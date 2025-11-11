import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
// If you're using Auth0 or your own token store, import your getter:
import { getAllNews } from "@/api/getAllNews";
import CreateGroupModal from "@/components/createGroup";
import { useAuth0 } from "react-native-auth0"; // adjust if you use another auth source
import { T_NEWSLISTING } from "./types";

type Group = {
    id: string;
    name: string;
    members: number;
    avatar?: string; // remote url (optional)
};

const NewsListing: React.FC<T_NEWSLISTING> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [news, setNews] = useState([]);
    const [loadCreateGroupModal, setLoadCreateGroupModal] = useState<boolean>(false);

    // Example token source — swap for your real one
    const { getCredentials } = useAuth0();

    const fetchNews = useCallback(async () => {
        setLoading(true);
        try {
            const creds = await getCredentials();
            const token = creds?.accessToken || "";
            const res = await getAllNews(token);
            console.log(res.data)
            setNews(res.data.items);
        } catch (e) {
            console.log("Failed to load news", e);
        } finally {
            setLoading(false);
        }
    }, [getCredentials]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const creds = await getCredentials();
            const token = creds?.accessToken || "";
            const res = await getAllNews(token);
            setNews(res.data.items);
        } catch (e) {
            console.log("Refresh news failed", e);
        } finally {
            setRefreshing(false);
        }
    }, [getCredentials]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const onBack = () => navigation?.goBack?.();

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.itemRow}
            onPress={() => { navigation?.navigate?.("NewsDetails", { imageUrl: item.url, title: item.title, body: item.description, timeAgo: item.createdAt }) }}
        >
            <Image
                style={styles.avatar}
                source={{
                    uri:
                        item.url ??
                        "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=200&h=200&fit=crop",
                }}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.itemSubtitle} numberOfLines={2}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C3C7CD" />
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.select({ ios: "padding", android: undefined })}
            style={[styles.container, { paddingTop: insets.top + 4 }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onBack}
                    hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                >
                    <Ionicons name="chevron-back" size={24} color="#101828" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.title}>News</Text>
                </View>

                <TouchableOpacity
                    onPress={() => { setLoadCreateGroupModal(true) }}
                    hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                >
                    {/* <Ionicons name="person-add-outline" size={22} color="#101828" /> */}
                </TouchableOpacity>
            </View>

            {/* Loading state */}
            {loading ? (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <ActivityIndicator />
                </View>
            ) : (
                <FlatList
                    data={news}
                    keyExtractor={(g) => g.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={{ padding: 32, alignItems: "center" }}>
                            <Text style={{ color: "#6B7280" }}>
                                {query ? "No groups match your search." : "No news yet."}
                            </Text>
                        </View>
                    }
                />
            )}
            <CreateGroupModal
                visible={loadCreateGroupModal}
                onClose={() => { setLoadCreateGroupModal(false) }}
                onAddMembers={() => { }}
            />
        </KeyboardAvoidingView>
    );
}

export default NewsListing;