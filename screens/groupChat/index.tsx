// GroupChat.tsx
import { getChatMessages } from "@/api/getChatMessages";
import { getLoggedInUser } from "@/api/getLoggedInUser";
import { createChatSocket, destroyChatSocket, getChatSocket } from "@/socket";
import { isoToTime } from "@/utils/isoToTime";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { SendMessageDto, ServerMessage, T_GROUPCHAT, UiMessage } from "./types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://your-api.example.com";

const INITIAL_DATE_PILL: UiMessage = { id: "d0", text: "", createdAt: "", sender: "other", dateTag: "Today" };

const GroupChat: React.FC<T_GROUPCHAT> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const listRef = useRef<FlatList<UiMessage>>(null);
    const { getCredentials, user } = useAuth0();

    const [token, setToken] = useState<string | null>(null);
    const [composer, setComposer] = useState("");
    const [items, setItems] = useState<UiMessage[]>([INITIAL_DATE_PILL]);
    const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);

    // pagination state
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [refreshingNewer, setRefreshingNewer] = useState(false);
    const [hasMoreOlder, setHasMoreOlder] = useState(true);

    // for dedupe
    const idsRef = useRef<Set<string>>(new Set(["d0"]));

    // Replace this with your real user id if you have it
    const [myUserId, setMyUserId] = useState<string | null>(null);

    const groupId = route.params.id as string;
    const groupAvatar = route.params.avatar ?? "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=200&h=200&fit=crop";
    const groupName = route.params.name as string;
    const groupMembersCount = route.params.members as number;

    // Auth
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const creds = await getCredentials();
                if (mounted) setToken(creds?.accessToken ?? null);
            } catch {
                setToken(null);
            }
        })();
        return () => { mounted = false; };
    }, [getCredentials]);

    useEffect(() => {
        const getMe = async () => {
            const user = await getLoggedInUser(token || "");
            if (user && user.data) {
                setMyUserId(user.data.id);
            }
        }
        if (token) {
            getMe();
        }
    }, [token])

    // ---- Mapping helpers
    const mapServerToUi = useCallback((m: ServerMessage): UiMessage => {
        const isMe = !!myUserId && m.sender.id === myUserId;
        return {
            id: m.id,
            text: m.text,
            createdAt: isoToTime(m.createdAt),
            sender: isMe ? "me" : "other",
            username: isMe ? undefined : m.sender.username,
            picture: isMe ? undefined : (m.sender.picture ?? undefined),
            showStatus: isMe ? true : undefined,
            dateTag: null,
        };
    }, [myUserId]);

    // ---- REST history client
    async function fetchMessagesPage({
        limit = 25,
        beforeId,
        afterId,
    }: {
        limit?: number;
        beforeId?: string;
        afterId?: string;
    }) {
        if (!token) return [];
        return await getChatMessages(token, groupId, { limit, beforeId, afterId });
    }

    // ---- Initial load (last 25)
    const initialLoad = useCallback(async () => {
        if (!token) return;
        setLoadingInitial(true);
        try {
            const page = await fetchMessagesPage({ limit: 25 });
            // assuming backend returns newest→oldest
            const chronological = [...page].reverse().map(mapServerToUi);
            const withPill = [INITIAL_DATE_PILL, ...chronological];
            idsRef.current = new Set(withPill.map(m => m.id));
            setItems(withPill);
            // scroll to bottom after paint
            requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: false }));
            setHasMoreOlder(page.length === 25); // naive hasMore flag
        } catch (e) {
            // optionally toast/log
        } finally {
            setLoadingInitial(false);
        }
    }, [token, groupId, mapServerToUi]);

    // ---- Load older (before first real message)
    const loadOlder = useCallback(async () => {
        if (loadingOlder || !hasMoreOlder || !token) return;
        // find first non-date message id
        const firstReal = items.find((m) => !m.dateTag);
        if (!firstReal) return;
        setLoadingOlder(true);
        try {
            const page = await fetchMessagesPage({ limit: 25, beforeId: firstReal.id });
            // If empty, no more
            if (!page.length) {
                setHasMoreOlder(false);
                return;
            }
            const chronological = [...page].reverse().map(mapServerToUi);
            // prepend, but dedupe
            setItems((prev) => {
                const next: UiMessage[] = [];
                for (const m of chronological) {
                    if (!idsRef.current.has(m.id)) {
                        idsRef.current.add(m.id);
                        next.push(m);
                    }
                }
                return [INITIAL_DATE_PILL, ...next, ...prev.filter(m => m.id !== "d0")];
            });
        } catch (e) {
            // optionally toast/log
        } finally {
            setLoadingOlder(false);
        }
    }, [items, loadingOlder, hasMoreOlder, token, mapServerToUi]);

    // (Optional) pull-to-refresh newer (after last message) — handy if you ever want it
    const loadNewer = useCallback(async () => {
        if (refreshingNewer || !token) return;
        const last = [...items].reverse().find((m) => !m.dateTag);
        if (!last) return;
        setRefreshingNewer(true);
        try {
            const page = await fetchMessagesPage({ limit: 25, afterId: last.id });
            // Server returns newest→oldest; we want chronological append:
            const chronological = [...page].reverse().map(mapServerToUi);
            setItems((prev) => {
                const appended: UiMessage[] = [];
                for (const m of chronological) {
                    if (!idsRef.current.has(m.id)) {
                        idsRef.current.add(m.id);
                        appended.push(m);
                    }
                }
                return [...prev, ...appended];
            });
            if (page.length < 25) {
                // no-op; you could track hasMoreNewer if needed
            }
        } finally {
            setRefreshingNewer(false);
        }
    }, [items, refreshingNewer, token, mapServerToUi]);

    // ---- Socket join + initial history
    useEffect(() => {
        if (!token) return;
        const socket = createChatSocket({ baseUrl: API_BASE_URL, token });
        const onConnect = () => socket.emit("join", { groupId });
        const onJoined = () => { initialLoad(); };

        const onNewMessage = (msg: ServerMessage) => {
            const mapped = mapServerToUi(msg);
            setItems((curr) => {
                if (idsRef.current.has(mapped.id)) return curr;
                idsRef.current.add(mapped.id);
                return [...curr, mapped];
            });
            requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
        };

        const onTyping = (payload: { userId: string; groupId: string; isTyping: boolean }) => {
            if (payload.groupId !== groupId) return;
            if (payload.userId === myUserId) return;
            setIsSomeoneTyping(Boolean(payload.isTyping));
            if (payload.isTyping) {
                clearTimeout((onTyping as any)._t);
                (onTyping as any)._t = setTimeout(() => setIsSomeoneTyping(false), 2500);
            }
        };

        socket.on("connect", onConnect);
        socket.on("joined", onJoined);
        socket.on("new_message", onNewMessage);
        socket.on("typing", onTyping);

        return () => {
            socket.off("connect", onConnect);
            socket.off("joined", onJoined);
            socket.off("new_message", onNewMessage);
            socket.off("typing", onTyping);
            destroyChatSocket();
        };
    }, [token, groupId, initialLoad, mapServerToUi]);

    // ---- Send flow (unchanged, keeps optimistic UI)
    const send = useCallback(() => {
        const text = composer.trim();
        if (!text) return;

        const tempId = `temp-${Date.now()}`;
        const optimistic: UiMessage = {
            id: tempId,
            tempId,
            text,
            createdAt: isoToTime(new Date().toISOString()),
            sender: "me",
            showStatus: false,
            dateTag: null,
        };
        // setItems((prev) => [...prev, optimistic]);
        setComposer("");
        requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));

        const socket = getChatSocket();
        const dto: SendMessageDto = { text };
        socket?.emit("send_message", { groupId, dto }, (ack?: ServerMessage) => {
            if (!ack) return;
            setItems((curr) => {
                const idx = curr.findIndex((m) => m.tempId === tempId);
                if (idx === -1) return curr;
                const mapped: UiMessage = {
                    id: ack.id,
                    text: ack.text,
                    createdAt: isoToTime(ack.createdAt),
                    sender: "me",
                    showStatus: true,
                    dateTag: null,
                };
                const copy = [...curr];
                copy[idx] = mapped;
                return copy;
            });
            idsRef.current.add(ack.id);
        });
    }, [composer, groupId]);

    // ---- Composer typing (unchanged)
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onChangeComposer = useCallback((val: string) => {
        setComposer(val);
        const socket = getChatSocket();
        socket?.emit("typing", { groupId, isTyping: true });
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => {
            socket?.emit("typing", { groupId, isTyping: false });
        }, 1200);
    }, [groupId]);

    // ---- UI renderers (unchanged except refresh + footer)
    const renderHeader = () => (
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
                <Ionicons name="chevron-back" size={24} color="#111827" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("GroupInfo", { id: groupId, avatar: groupAvatar, name: groupName, members: groupMembersCount })}
                style={styles.headerCenter}
            >
                <Image source={{ uri: groupAvatar }} style={styles.groupAvatar} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.groupTitle}>{groupName}</Text>
                    <Text style={styles.groupSubtitle}>{isSomeoneTyping ? "typing…" : `${groupMembersCount} Members`}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerIconBtn}>
                    <Ionicons name="videocam-outline" size={20} color="#111827" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIconBtn}>
                    <Ionicons name="call-outline" size={20} color="#111827" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const DatePill = ({ label }: { label: string }) => (
        <View style={styles.datePillWrap}><Text style={styles.datePillText}>{label}</Text></View>
    );

    const Bubble = ({ item }: { item: UiMessage }) => {
        if (item.dateTag) return <DatePill label={item.dateTag} />;
        const isMe = item.sender === "me";
        return (
            <View style={[styles.row, isMe ? styles.rowRight : styles.rowLeft]}>
                {!isMe && item.picture ? <Image source={{ uri: item.picture }} style={styles.avatar} /> : <View style={{ width: 32 }} />}
                <View style={[styles.bubbleWrap, isMe ? styles.bubbleWrapRight : styles.bubbleWrapLeft]}>
                    {!isMe && item.username ? <Text style={styles.name}>{item.username}</Text> : null}
                    <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                        <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>{item.text}</Text>
                        <View style={styles.metaRow}>
                            <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextOther]}>{item.createdAt}</Text>
                            {isMe && (
                                <Ionicons name={item.showStatus ? "checkmark-done" : "checkmark"} size={14} color="#E6F4EA" style={{ marginLeft: 6, opacity: 0.95 }} />
                            )}
                        </View>
                    </View>
                </View>
                {isMe ? <View style={{ width: 32 }} /> : null}
            </View>
        );
    };

    const ListTopLoader = () =>
        loadingOlder ? (
            <View style={{ paddingVertical: 10, alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        ) : null;

    return (
        <KeyboardAvoidingView
            behavior={Platform.select({ ios: "padding", android: undefined })}
            style={styles.container}
        >
            {renderHeader()}

            <FlatList
                ref={listRef}
                data={items}
                keyExtractor={(m) => m.id}
                renderItem={({ item }) => <Bubble item={item} />}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8, paddingTop: 8 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<ListTopLoader />}
                onEndReachedThreshold={0.1}
                // We want "load older" when user scrolls UP near the top.
                // Since list is not inverted, we use onScroll to check if we're near top:
                onScroll={useCallback((e: { nativeEvent: { contentOffset: { y: any; }; }; }) => {
                    const offsetY = e.nativeEvent.contentOffset.y;
                    if (offsetY < 30) loadOlder(); // near top → get older messages
                }, [loadOlder])}
                refreshControl={
                    <RefreshControl refreshing={refreshingNewer || loadingInitial} onRefresh={loadNewer} />
                }
            />

            <View style={[styles.composerWrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
                <View style={styles.composerBar}>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="add" size={20} color="#6B7280" /></TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        value={composer}
                        onChangeText={onChangeComposer}
                        placeholder="Type your message..."
                        placeholderTextColor="#BDBDBD"
                        returnKeyType="send"
                        onSubmitEditing={send}
                    />
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="happy-outline" size={20} color="#6B7280" /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="image-outline" size={20} color="#6B7280" /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="mic-outline" size={20} color="#6B7280" /></TouchableOpacity>
                    <TouchableOpacity style={styles.sendBtn} onPress={send} activeOpacity={0.9}>
                        <Ionicons name="arrow-up" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default GroupChat;
