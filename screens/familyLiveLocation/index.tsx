import { ApiGroup, getMyGroups } from "@/api/getMyGroups";
import { ApiGroupMember, getGroupMembers } from "@/api/getGroupMembers";
import { getChatMessages } from "@/api/getChatMessages";
import BackButton from "@/components/backButton";
import { GREEN, MUTED } from "@/constants/theme";
import { createChatSocket } from "@/socket";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { MemberLocation, T_FAMILYLIVELOCATION } from "./types";

const FALLBACK_REGION: Region = {
    latitude: 33.6844,
    longitude: 73.0479,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    if (!Number.isFinite(diffMs) || diffMs < 0) return "just now";
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

const FamilyLiveLocation: React.FC<T_FAMILYLIVELOCATION> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { getCredentials } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [familyGroup, setFamilyGroup] = useState<ApiGroup | null>(null);
    const [members, setMembers] = useState<ApiGroupMember[]>([]);
    const [locations, setLocations] = useState<Record<string, MemberLocation>>({});
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const creds = await getCredentials();
                const accessToken = creds?.accessToken ?? null;
                if (!accessToken) return;

                const groupsRes = await getMyGroups(accessToken);
                const apiGroups: ApiGroup[] = Array.isArray(groupsRes.data) ? groupsRes.data : [];
                const family = apiGroups.find((g) => g.type?.toLowerCase() === "family") ?? null;
                setFamilyGroup(family);
                if (!family) return;

                const membersRes = await getGroupMembers(accessToken, family.id);
                const apiMembers: ApiGroupMember[] = Array.isArray(membersRes?.data) ? membersRes.data : [];
                setMembers(apiMembers);

                const history = await getChatMessages(accessToken, family.id, { limit: 50 });
                const seeded: Record<string, MemberLocation> = {};
                for (const m of (history as any[]) ?? []) {
                    if (m?.kind === "location" && m?.location && m?.sender?.id) {
                        const existing = seeded[m.sender.id];
                        if (!existing || new Date(m.createdAt) > new Date(existing.updatedAt)) {
                            seeded[m.sender.id] = {
                                userId: m.sender.id,
                                username: m.sender.username,
                                picture: m.sender.picture,
                                lat: m.location.lat,
                                lng: m.location.lng,
                                updatedAt: m.createdAt,
                            };
                        }
                    }
                }
                setLocations(seeded);

                const socket = createChatSocket({ baseUrl: "", token: accessToken });
                socket.emit("join", { groupId: family.id });
                const onNewMessage = (m: any) => {
                    if (m?.groupId !== family.id) return;
                    if (m?.kind === "location" && m?.location && m?.sender?.id) {
                        setLocations((prev) => ({
                            ...prev,
                            [m.sender.id]: {
                                userId: m.sender.id,
                                username: m.sender.username,
                                picture: m.sender.picture,
                                lat: m.location.lat,
                                lng: m.location.lng,
                                updatedAt: m.createdAt,
                            },
                        }));
                    }
                };
                socket.on("new_message", onNewMessage);
                cleanupRef.current = () => socket.off("new_message", onNewMessage);
            } catch (e) {
                console.log("FamilyLiveLocation load error", e);
            } finally {
                setLoading(false);
            }
        })();

        return () => cleanupRef.current?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const locationList = Object.values(locations);
    const initialRegion: Region = locationList[0]
        ? { latitude: locationList[0].lat, longitude: locationList[0].lng, latitudeDelta: 0.05, longitudeDelta: 0.05 }
        : FALLBACK_REGION;

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={[styles.backBtnWrap, { paddingTop: insets.top + 12 }]}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={GREEN} />
                </View>
            </View>
        );
    }

    if (!familyGroup) {
        return (
            <View style={styles.container}>
                <View style={[styles.backBtnWrap, { paddingTop: insets.top + 12 }]}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>
                <View style={styles.center}>
                    <Ionicons name="people-outline" size={44} color={MUTED} />
                    <Text style={styles.emptyTitle}>No Family Group Yet</Text>
                    <Text style={styles.emptyBody}>
                        Create or join a family-type group to start sharing live locations with them.
                    </Text>
                    <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate("GroupListing", {})}>
                        <Text style={styles.emptyBtnText}>Go to Groups</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.backBtnWrap, { paddingTop: insets.top + 12 }]}>
                <BackButton onPress={() => navigation.goBack()} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Family Live Location</Text>
                <Text style={styles.subtitle}>
                    See where {familyGroup.name} members are sharing their live location from the group chat.
                </Text>

                <View style={styles.mapCard}>
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={initialRegion}
                    >
                        {locationList.map((loc) => (
                            <Marker key={loc.userId} coordinate={{ latitude: loc.lat, longitude: loc.lng }}>
                                <View style={styles.markerPin}>
                                    <Text style={styles.markerInitial}>{(loc.username?.[0] ?? "?").toUpperCase()}</Text>
                                </View>
                                <Callout>
                                    <View style={styles.calloutBox}>
                                        <Text style={styles.calloutTitle}>{loc.username}</Text>
                                        <Text style={styles.calloutMeta}>Updated {timeAgo(loc.updatedAt)}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                </View>

                <Text style={styles.sectionTitle}>FAMILY MEMBERS</Text>
                <View style={styles.card}>
                    {members.length === 0 ? (
                        <View style={{ padding: 16 }}>
                            <Text style={{ color: MUTED }}>No members found in this group.</Text>
                        </View>
                    ) : (
                        members.map((member, idx) => {
                            const loc = locations[member.id];
                            return (
                                <React.Fragment key={member.id}>
                                    <View style={styles.memberRow}>
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarInitial}>{(member.username?.[0] ?? "?").toUpperCase()}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.memberName}>{member.username ?? member.email}</Text>
                                            <View style={styles.memberStatusRow}>
                                                <View style={[styles.statusDot, { backgroundColor: loc ? "#16A34A" : "#CBD5E1" }]} />
                                                <Text style={styles.memberStatus}>
                                                    {loc ? `Sharing • ${timeAgo(loc.updatedAt)}` : "Not sharing location"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    {idx < members.length - 1 ? <View style={styles.memberDivider} /> : null}
                                </React.Fragment>
                            );
                        })
                    )}
                </View>

                <TouchableOpacity
                    style={styles.chatCta}
                    onPress={() => navigation.navigate("GroupChat", {
                        id: familyGroup.id,
                        name: familyGroup.name,
                        avatar: familyGroup.picture ?? "",
                        members: members.length,
                    })}
                >
                    <Ionicons name="location" size={18} color="#fff" />
                    <Text style={styles.chatCtaText}>Open Family Group Chat to Share Yours</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default FamilyLiveLocation;
