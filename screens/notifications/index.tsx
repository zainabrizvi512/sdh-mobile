import { AppNotification, getNotifications } from "@/api/getNotifications";
import { patchAllNotificationsRead, patchNotificationRead } from "@/api/patchNotificationRead";
import FancyAppHeader from "@/components/fancyAppHeader";
import { GREEN } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { styles } from "./styles";
import { T_NOTIFICATIONS } from "./types";

const ICON_BY_TYPE: Record<string, keyof typeof Ionicons.glyphMap> = {
    emergencyAlerts: "alert-circle-outline",
    news: "newspaper-outline",
    chatMessages: "chatbubble-ellipses-outline",
    donationUpdates: "heart-outline",
    general: "notifications-outline",
};

function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

const Notifications: React.FC<T_NOTIFICATIONS> = ({ navigation }) => {
    const { getCredentials } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [items, setItems] = useState<AppNotification[]>([]);

    const load = useCallback(async () => {
        try {
            const { accessToken } = await getCredentials();
            const data = await getNotifications(accessToken);
            setItems(data);
        } catch (e) {
            console.log("Notifications load error", e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await load();
            setLoading(false);
        })();
    }, [load]);

    const onRefresh = async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    };

    const onPressItem = async (item: AppNotification) => {
        if (item.read) return;
        setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
        try {
            const { accessToken } = await getCredentials();
            await patchNotificationRead(accessToken, item.id);
        } catch (e) {
            console.log("markRead error", e);
        }
    };

    const onMarkAllRead = async () => {
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));
        try {
            const { accessToken } = await getCredentials();
            await patchAllNotificationsRead(accessToken);
        } catch (e) {
            console.log("markAllRead error", e);
        }
    };

    const hasUnread = items.some((n) => !n.read);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
            <FancyAppHeader
                title="Notifications"
                subtitle="Alerts, chats & updates in one place"
                badge={{ icon: "notifications", label: hasUnread ? `${items.filter((n) => !n.read).length} UNREAD` : "ALL CAUGHT UP" }}
                onBack={() => navigation.goBack()}
                rightElement={
                    hasUnread ? (
                        <TouchableOpacity onPress={onMarkAllRead}>
                            <Text style={styles.markAllText}>Mark all read</Text>
                        </TouchableOpacity>
                    ) : undefined
                }
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={GREEN} />
                </View>
            ) : items.length === 0 ? (
                <View style={styles.center}>
                    <View style={styles.emptyIconCircle}>
                        <Ionicons name="notifications-off-outline" size={36} color={GREEN} />
                    </View>
                    <Text style={styles.emptyTitle}>You're all caught up!</Text>
                    <Text style={styles.emptyText}>
                        New alerts, chat messages, and updates will show up here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listBody}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[GREEN]} />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.card, !item.read && styles.cardUnread]}
                            onPress={() => onPressItem(item)}
                        >
                            <View style={styles.icon}>
                                <Ionicons name={ICON_BY_TYPE[item.type] ?? "notifications-outline"} size={18} color={GREEN} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                {!!item.body && <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>}
                                <Text style={styles.cardTime}>{timeAgo(item.createdAt)}</Text>
                            </View>
                            {!item.read && <View style={styles.unreadDot} />}
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default Notifications;
