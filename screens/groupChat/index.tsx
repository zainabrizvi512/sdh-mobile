// GroupChat.tsx
import { getChatMessages } from "@/api/getChatMessages";
import { getLoggedInUser } from "@/api/getLoggedInUser";
import { postChatAudio } from "@/api/postChatAudio";
import { postChatImages } from "@/api/postChatImages";
import { createChatSocket, destroyChatSocket, getChatSocket } from "@/socket";
import { ensureLocationReady } from "@/utils/ensureLocationReady";
import { isoToTime } from "@/utils/isoToTime";
import { Ionicons } from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Linking,
    Platform,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmojiPicker, { EmojiType } from "rn-emoji-keyboard";
import { styles } from "./styles";
import { SendMessageDto, ServerMessage, T_GROUPCHAT, UiMessage } from "./types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://your-api.example.com";
const INITIAL_DATE_PILL: UiMessage = { id: "d0", kind: "system", text: "", createdAt: "", sender: "other", dateTag: "Today" };

const GroupChat: React.FC<T_GROUPCHAT> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const listRef = useRef<FlatList<UiMessage>>(null);
    const { getCredentials } = useAuth0();
    const inputRef = useRef<TextInput | null>(null);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [composer, setComposer] = useState("");
    const [items, setItems] = useState<UiMessage[]>([INITIAL_DATE_PILL]);
    const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);

    const recordingRef = useRef<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordStartAt, setRecordStartAt] = useState<number | null>(null);

    // live location
    const [isSharing, setIsSharing] = useState(false);
    const locWatchRef = useRef<Location.LocationSubscription | null>(null);
    const lastSentRef = useRef<number>(0);

    // pagination
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [refreshingNewer, setRefreshingNewer] = useState(false);
    const [hasMoreOlder, setHasMoreOlder] = useState(true);

    // dedupe
    const idsRef = useRef<Set<string>>(new Set(["d0"]));

    const [myUserId, setMyUserId] = useState<string | null>(null);

    const groupId = route.params.id as string;
    const groupAvatar = route.params.avatar ?? "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=200&h=200&fit=crop";
    const groupName = route.params.name as string;
    const groupMembersCount = route.params.members as number;

    // ---- Auth
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

    const onSelectEmoji = useCallback((e: EmojiType) => {
        // e.emoji is the character
        setComposer(prev => {
            const next = (prev ?? "") + e.emoji;
            // fire typing event just like normal typing
            const socket = getChatSocket();
            socket?.emit("typing", { groupId, isTyping: true });
            if (typingTimer.current) clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => {
                socket?.emit("typing", { groupId, isTyping: false });
            }, 1200);
            return next;
        });
    }, [groupId]);

    async function ensureMicPermission(): Promise<boolean> {
        const current = await Audio.getPermissionsAsync();
        if (current.granted) return true;

        const req = await Audio.requestPermissionsAsync();
        if (req.granted) return true;

        // User denied (maybe "Don't ask again"). Offer Settings shortcut.
        Alert.alert(
            "Microphone permission needed",
            "Enable microphone access in Settings to record voice messages.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: () => Linking.openSettings() }
            ]
        );
        return false;
    }

    async function startRecording() {
        try {
            const ok = await ensureMicPermission();
            if (!ok) return;

            const perm = await Audio.requestPermissionsAsync();
            console.log(perm)
            if (!perm.granted) return;

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                playThroughEarpieceAndroid: false,
            });

            const rec = new Audio.Recording();
            await rec.prepareToRecordAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY // m4a on iOS/Android
            );
            await rec.startAsync();
            recordingRef.current = rec;
            setRecordStartAt(Date.now());
            setIsRecording(true);
        } catch (e) {
            setIsRecording(false);
        }
    }

    async function stopRecordingAndSend() {
        try {
            const rec = recordingRef.current;
            if (!rec) return;
            await rec.stopAndUnloadAsync();
            setIsRecording(false);
            const uri = rec.getURI();
            if (!uri) return;
            const status = await rec.getStatusAsync();
            const durationMs = (status as any).durationMillis ?? (recordStartAt ? Date.now() - recordStartAt : undefined);
            const mime = Platform.OS === "ios" ? "audio/m4a" : "audio/m4a";
            await postChatAudio(uri, mime, token || "", groupId); // implement below
        } catch (e) {
            console.log(e)
            setIsRecording(false);
        } finally {
            recordingRef.current = null;
            setRecordStartAt(null);
        }
    }

    async function ensureMediaLibPermission(): Promise<boolean> {
        const cur = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (cur.granted) return true;
        const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (req.granted) return true;
        Alert.alert(
            "Photos permission needed",
            "Enable photo library access in Settings to send images.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: () => Linking.openSettings() },
            ]
        );
        return false;
    }

    /** Opens the OS picker. Supports multiple when available; gracefully falls back to single. */
    async function pickImages(): Promise<Array<{ uri: string; type: string; fileName: string; width?: number; height?: number }>> {
        const ok = await ensureMediaLibPermission();
        if (!ok) return [];

        // Try multi-select; if the platform/SDK doesn't support it, we fallback to single
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.9,
            allowsMultipleSelection: true,
            exif: false,
            selectionLimit: 5, // iOS 17+/Android 14+ uses this; others ignore
        } as any);

        if (result.canceled) return [];

        // result.assets: Array<{ uri, fileName?, width?, height?, mimeType? }>
        return (result.assets ?? []).map((a, idx) => {
            const uri = a.uri;
            const type =
                a.mimeType ??
                // simple guess by extension
                (uri.endsWith(".png") ? "image/png" :
                    uri.match(/\.jpe?g$/i) ? "image/jpeg" :
                        uri.endsWith(".webp") ? "image/webp" :
                            uri.endsWith(".gif") ? "image/gif" :
                                "image/jpeg");
            const fileName =
                a.fileName ??
                `photo-${Date.now()}-${idx}.${(type.split("/")[1] || "jpg")}`;

            return { uri, type, fileName, width: a.width, height: a.height };
        });
    }

    useEffect(() => {
        const getMe = async () => {
            const user = await getLoggedInUser(token || "");
            if (user && user.data) setMyUserId(user.data.id);
        };
        if (token) getMe();
    }, [token]);

    // ---- Helpers
    const mapServerToUi = useCallback((m: any): UiMessage => {
        const kind = m?.kind ?? (m?.type?.toLowerCase?.() ?? "text"); // tolerate `type`
        const isMe = !!myUserId && m?.sender?.id === myUserId;
        return {
            id: m.id,
            kind,
            text: m.text,
            location: m.location,
            attachments: m.attachments ?? [],
            createdAt: isoToTime(m.createdAt),
            sender: isMe ? "me" : "other",
            username: isMe ? undefined : m?.sender?.username,
            picture: isMe ? undefined : (m?.sender?.picture ?? undefined),
            showStatus: isMe ? true : undefined,
            dateTag: null,
        };
    }, [myUserId]);

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

    // ---- Initial load
    const initialLoad = useCallback(async () => {
        if (!token) return;
        setLoadingInitial(true);
        try {
            const page = await fetchMessagesPage({ limit: 25 });
            const chronological = [...page].reverse().map(mapServerToUi);
            const withPill = [INITIAL_DATE_PILL, ...chronological];
            idsRef.current = new Set(withPill.map(m => m.id));
            setItems(withPill);
            requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: false }));
            setHasMoreOlder(page.length === 25);
        } catch {
            // log
        } finally {
            setLoadingInitial(false);
        }
    }, [token, groupId, mapServerToUi]);

    // ---- Load older
    const loadOlder = useCallback(async () => {
        if (loadingOlder || !hasMoreOlder || !token) return;
        const firstReal = items.find((m) => !m.dateTag);
        if (!firstReal) return;
        setLoadingOlder(true);
        try {
            const page = await fetchMessagesPage({ limit: 25, beforeId: firstReal.id });
            if (!page.length) {
                setHasMoreOlder(false);
                return;
            }
            const chronological = [...page].reverse().map(mapServerToUi);
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
        } catch {
            // log
        } finally {
            setLoadingOlder(false);
        }
    }, [items, loadingOlder, hasMoreOlder, token, mapServerToUi]);

    // ---- Load newer
    const loadNewer = useCallback(async () => {
        if (refreshingNewer || !token) return;
        const last = [...items].reverse().find((m) => !m.dateTag);
        if (!last) return;
        setRefreshingNewer(true);
        try {
            const page = await fetchMessagesPage({ limit: 25, afterId: last.id });
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
        } finally {
            setRefreshingNewer(false);
        }
    }, [items, refreshingNewer, token, mapServerToUi]);

    // ---- Socket setup
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
    }, [token, groupId, initialLoad, mapServerToUi, myUserId]);

    // ---- Send text
    const send = useCallback(() => {
        const text = composer.trim();
        if (!text) return;

        const tempId = `temp-${Date.now()}`;

        setComposer("");
        requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));

        const socket = getChatSocket();
        const dto: SendMessageDto = { kind: "text", text };
        socket?.emit("send_message", { groupId, dto }, (ack?: ServerMessage) => {
            if (!ack) return;
            setItems((curr) => {
                const idx = curr.findIndex((m) => m.tempId === tempId);
                if (idx === -1) return curr;
                const mapped = mapServerToUi(ack);
                const copy = [...curr];
                copy[idx] = mapped;
                return copy;
            });
            idsRef.current.add(ack.id);
        });
    }, [composer, groupId, mapServerToUi]);

    // ---- Typing events
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

    // ---- Live location sharing
    function shouldSendUpdate(now: number, prev: number, movedMeters: number) {
        const MIN_MS = 5000;  // >= 5s
        const MIN_MOVE = 10;  // >= 10m (set high; we’re not computing actual distance here)
        return (now - prev > MIN_MS) || movedMeters >= MIN_MOVE;
    }

    function emitLocation(lat: number, lng: number, accuracy?: number, isInitial?: boolean) {
        const socket = getChatSocket();
        const dto: SendMessageDto = { kind: "location", location: { lat, lng, accuracy } };

        // server will ack with a ServerMessage; append in list on ack
        socket?.emit(isInitial ? "start_live_location" : "live_location_update", { groupId, dto }, (ack?: ServerMessage) => {
            if (!ack) return;
            const mapped = mapServerToUi(ack);
            setItems((curr) => {
                if (idsRef.current.has(mapped.id)) return curr;
                idsRef.current.add(mapped.id);
                return [...curr, mapped];
            });
            requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
        });
    }

    function haversine(a: { lat: number, lng: number }, b: { lat: number, lng: number }) {
        const R = 6371000; // m
        const toRad = (x: number) => x * Math.PI / 180;
        const dLat = toRad(b.lat - a.lat);
        const dLng = toRad(b.lng - a.lng);
        const s1 = Math.sin(dLat / 2), s2 = Math.sin(dLng / 2);
        const aa = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
        return 2 * R * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    }

    async function startLiveLocation() {
        try {
            const ready = await ensureLocationReady(); // your util; includes hasServicesEnabledAsync etc.
            if (!ready.ok) {
                Alert.alert("Location", ready.status ?? "Location not ready");
                return;
            }

            const perm = await Location.requestForegroundPermissionsAsync();
            if (perm.status !== "granted") {
                Alert.alert("Location", "Permission is required to share live location.");
                return;
            }

            // 1) Try last known (often available on real devices; emulators may be null)
            let first = await Location.getLastKnownPositionAsync();
            if (!first) {
                // 2) Fall back to a quick high-accuracy watch to get the first fix
                first = await new Promise<Location.LocationObject | null>((resolve) => {
                    let resolved = false;
                    const timeout = setTimeout(() => {
                        if (!resolved) resolve(null);
                    }, 8000); // give GPS a moment

                    Location.watchPositionAsync(
                        {
                            accuracy: Location.Accuracy.High,   // get a reliable first fix
                            timeInterval: 1000,
                            distanceInterval: 0,
                        },
                        (pos) => {
                            if (!resolved) {
                                resolved = true;
                                clearTimeout(timeout);
                                resolve(pos);
                            }
                        }
                    ).then((sub) => {
                        // stop the bootstrap watch immediately after first fix
                        setTimeout(() => sub.remove(), 0);
                    }).catch(() => resolve(null));
                });
            }

            if (!first) {
                // On cold emulator with no injected coord, we’ll still fail here.
                Alert.alert(
                    "Location",
                    "Current location is unavailable. On emulators, set a mock location (… → Location) and try again."
                );
                return;
            }

            // Emit initial point
            emitLocation(
                first.coords.latitude,
                first.coords.longitude,
                first.coords.accuracy ?? undefined,
                true
            );

            // 3) Start the ongoing watch (balanced to save battery)
            let lastSent = { lat: first.coords.latitude, lng: first.coords.longitude };
            lastSentRef.current = Date.now();

            locWatchRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 4000,
                    distanceInterval: 5,
                },
                (pos) => {
                    const now = Date.now();
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    const acc = pos.coords.accuracy ?? undefined;

                    const moved = haversine(lastSent, { lat, lng });
                    const enoughTime = now - (lastSentRef.current || 0) > 5000;
                    const enoughMove = moved >= 10; // meters

                    if (enoughTime || enoughMove) {
                        emitLocation(lat, lng, acc, false);
                        lastSent = { lat, lng };
                        lastSentRef.current = now;
                    }
                }
            );

            setIsSharing(true);
        } catch (e) {
            console.log("startLiveLocation error", e);
            Alert.alert("Location", "Could not start live location.");
        }
    }


    function stopLiveLocation() {
        try { locWatchRef.current?.remove(); } catch { }
        locWatchRef.current = null;
        setIsSharing(false);

        const socket = getChatSocket();
        socket?.emit("stop_live_location", { groupId });
    }

    useEffect(() => {
        return () => {
            try { locWatchRef.current?.remove(); } catch { }
            locWatchRef.current = null;
        };
    }, []);

    // ---- UI bits
    const ImageGridBubble = ({
        atts,
        isMe,
        time,
    }: {
        atts: Array<{ url: string }>;
        isMe: boolean;
        time: string;
    }) => {
        const open = (u: string) => Linking.openURL(u);

        // simple 2-column grid
        return (
            <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                    {atts.map((a, i) => (
                        <TouchableOpacity
                            key={i}
                            activeOpacity={0.85}
                            onPress={() => open(a.url)}
                            style={{ overflow: "hidden", borderRadius: 10 }}
                        >
                            <Image
                                source={{ uri: a.url }}
                                style={{
                                    width: 140,
                                    height: 140,
                                    backgroundColor: "#E5E7EB",
                                }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "flex-end" }}>
                    <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextOther]}>{time}</Text>
                </View>
            </View>
        );
    };

    const AudioBubble = ({
        url,
        durationMs, // unused in compact UI, but kept for API parity
        isMe,
    }: {
        url: string;
        durationMs?: number;
        isMe: boolean;
    }) => {
        const soundRef = useRef<Audio.Sound | null>(null);
        const [playing, setPlaying] = useState(false);

        useEffect(() => {
            return () => {
                soundRef.current?.unloadAsync().catch(() => { });
            };
        }, []);

        const togglePlay = async () => {
            if (!soundRef.current) {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: url },
                    { shouldPlay: true },
                    (st) => {
                        if (!st.isLoaded) return;
                        if (st.didJustFinish) {
                            setPlaying(false);
                            soundRef.current?.setPositionAsync(0).catch(() => { });
                        }
                    }
                );
                soundRef.current = sound;
                setPlaying(true);
            } else {
                const status = await soundRef.current.getStatusAsync();
                if ((status as any).isPlaying) {
                    await soundRef.current.pauseAsync();
                    setPlaying(false);
                } else {
                    await soundRef.current.playAsync();
                    setPlaying(true);
                }
            }
        };

        return (
            <View
                // minimal container: no extra vertical padding
                style={[
                    {
                        borderRadius: 14,
                        paddingVertical: 0,
                        paddingHorizontal: 0,
                        backgroundColor: isMe ? "#1B5E20" : "#E5E7EB", // match your theme
                        alignSelf: "flex-start",
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={togglePlay}
                    activeOpacity={0.8}
                    style={[
                        {
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            alignItems: "center",
                            justifyContent: "center",
                            margin: 4, // slight inset so it doesn't hug bubble edges
                            backgroundColor: isMe ? "rgba(255,255,255,0.18)" : "#FFFFFF",
                        },
                    ]}
                >
                    <Ionicons
                        name={playing ? "pause" : "play"}
                        size={18}
                        color={isMe ? "#FFFFFF" : "#111827"}
                    />
                </TouchableOpacity>
            </View>
        );
    };



    const renderHeader = () => (
        <View style={[styles.header, { paddingTop: insets.top }]} >
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

    const LocationBubble = ({ lat, lng, time, isMe }: { lat: number; lng: number; time: string; isMe: boolean }) => {
        const openInMaps = () => {
            const url = Platform.select({
                ios: `http://maps.apple.com/?ll=${lat},${lng}`,
                android: `geo:${lat},${lng}?q=${lat},${lng}`,
                default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            });
            if (url) Linking.openURL(url);
        };

        return (
            <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                <View style={{ borderRadius: 12, overflow: "hidden" }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{ width: 220, height: 150 }}
                        pointerEvents="none"
                        initialRegion={{
                            latitude: lat,
                            longitude: lng,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                    >
                        <Marker coordinate={{ latitude: lat, longitude: lng }} />
                    </MapView>
                </View>

                <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextOther]}>{time}</Text>
                    <TouchableOpacity onPress={openInMaps} style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: isMe ? "#0EA5E9" : "#E5E7EB", borderRadius: 8 }}>
                        <Text style={{ color: isMe ? "#fff" : "#111827", fontWeight: "600" }}>Open in Maps</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const Bubble = ({ item }: { item: UiMessage }) => {
        if (item.dateTag) return <DatePill label={item.dateTag} />;
        const isMe = item.sender === "me";
        console.log(item);
        return (
            <View style={[styles.row, isMe ? styles.rowRight : styles.rowLeft]}>
                {!isMe && item.picture ? <Image source={{ uri: item.picture }} style={styles.avatar} /> : <View style={{ width: 32 }} />}
                <View style={[styles.bubbleWrap, isMe ? styles.bubbleWrapRight : styles.bubbleWrapLeft]}>
                    {!isMe && item.username ? <Text style={styles.name}>{item.username}</Text> : null}

                    {item.kind === "location" && item.location ? (
                        <LocationBubble lat={item.location.lat} lng={item.location.lng} time={item.createdAt} isMe={isMe} />
                    ) : item.kind === "audio" && item.attachments?.[0] ? (
                        <AudioBubble
                            url={item.attachments[0].url}
                            durationMs={item.attachments[0].durationMs}
                            isMe={isMe}
                        />
                    ) : item.kind === "image" && item.attachments?.length ? (
                        <ImageGridBubble
                            atts={item.attachments}
                            isMe={isMe}
                            time={item.createdAt}
                        />
                    ) : (
                        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                            <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>{item.text}</Text>
                            <View style={styles.metaRow}>
                                <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextOther]}>{item.createdAt}</Text>
                                {isMe && (
                                    <Ionicons name={item.showStatus ? "checkmark-done" : "checkmark"} size={14} color="#E6F4EA" style={{ marginLeft: 6, opacity: 0.95 }} />
                                )}
                            </View>
                        </View>
                    )}
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
                onScroll={useCallback((e: { nativeEvent: { contentOffset: { y: any } } }) => {
                    const offsetY = e.nativeEvent.contentOffset.y;
                    if (offsetY < 30) loadOlder();
                }, [loadOlder])}
                refreshControl={
                    <RefreshControl refreshing={refreshingNewer || loadingInitial} onRefresh={loadNewer} />
                }
            />

            {/* Live sharing status pill */}
            {isSharing ? (
                <View style={{ paddingHorizontal: 12, paddingBottom: 6 }}>
                    <View style={{ alignSelf: "flex-start", backgroundColor: "#DCFCE7", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="navigate" size={14} color="#065F46" style={{ marginRight: 6 }} />
                        <Text style={{ color: "#065F46", fontSize: 12 }}>Sharing live location…</Text>
                        <Text>{"  "}</Text>
                        <TouchableOpacity onPress={stopLiveLocation}>
                            <Text style={{ color: "#047857", fontWeight: "600", fontSize: 12 }}>Stop</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}
            {isRecording && (
                <View style={{ paddingHorizontal: 12, paddingBottom: 6 }}>
                    <View style={{
                        alignSelf: "flex-start",
                        backgroundColor: "#fde68a",
                        borderRadius: 999,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <Ionicons name="mic" size={14} color="#b45309" style={{ marginRight: 6 }} />
                        <Text style={{ color: "#92400e", fontSize: 12 }}>Recording… release to send</Text>
                    </View>
                </View>
            )}
            <View style={[styles.composerWrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
                <View style={styles.composerBar}>
                    {/* Toggle live location */}
                    <TouchableOpacity style={styles.iconBtn} onPress={() => (isSharing ? stopLiveLocation() : startLiveLocation())}>
                        <Ionicons name={isSharing ? "location" : "location-outline"} size={20} color={isSharing ? "#10B981" : "#6B7280"} />
                    </TouchableOpacity>

                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        value={composer}
                        onChangeText={onChangeComposer}
                        placeholder="Type your message..."
                        placeholderTextColor="#BDBDBD"
                        returnKeyType="send"
                        onSubmitEditing={send}
                    />

                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => {
                            // close OS keyboard if open; the picker will slide in
                            setIsEmojiOpen(true);
                        }}
                    >
                        <Ionicons name="happy-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={async () => {
                            try {
                                const assets = await pickImages();
                                if (!assets.length) return;

                                // (Optional) let the typed text be a caption for the images
                                const caption = composer.trim() || undefined;

                                // Clear composer if you used it as caption
                                if (caption) setComposer("");
                                console.log(assets.length, caption)
                                await postChatImages(
                                    assets.map(a => ({
                                        uri: a.uri,
                                        name: a.fileName,
                                        width: a.width,
                                        height: a.height,
                                    })),
                                    token || "",
                                    groupId,
                                    composer.trim() || undefined // optional caption
                                );
                            } catch (e) {
                                console.log(e);
                                Alert.alert("Error", "Could not pick or send images.");
                            }
                        }}
                    >
                        <Ionicons name="image-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconBtn, isRecording && { backgroundColor: "#fee2e2" }]}
                        onPressIn={startRecording}
                        onPressOut={stopRecordingAndSend}
                    >
                        <Ionicons name="mic-outline" size={20} color={isRecording ? "#dc2626" : "#6B7280"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendBtn} onPress={send} activeOpacity={0.9}>
                        <Ionicons name="arrow-up" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <EmojiPicker
                open={isEmojiOpen}
                onClose={() => {
                    setIsEmojiOpen(false);
                    // optional: bring the text input back into focus
                    requestAnimationFrame(() => inputRef.current?.focus());
                }}
                onEmojiSelected={onSelectEmoji}
                enableSearchBar
                enableRecentlyUsed
                categoryPosition="top"
            />
        </KeyboardAvoidingView>
    );
};

export default GroupChat;
