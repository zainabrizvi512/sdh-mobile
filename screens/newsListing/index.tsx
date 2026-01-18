import { getAllNews } from "@/api/getAllNews";
import CreateGroupModal from "@/components/createGroup";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { T_NEWSLISTING } from "./types";

const GREEN = "#1f3d18";
const BG_LIGHT = "#F4F7F4";

const NewsListing: React.FC<T_NEWSLISTING> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [news, setNews] = useState<any[]>([]);
    const [loadCreateGroupModal, setLoadCreateGroupModal] = useState<boolean>(false);

    const { getCredentials } = useAuth0();

    const fetchNews = useCallback(async () => {
        setLoading(true);
        try {
            const creds = await getCredentials();
            const token = creds?.accessToken || "";
            const res = await getAllNews(token);
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

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.newsCard}
            onPress={() => { 
                navigation?.navigate?.("NewsDetails", { 
                    imageUrl: item.url, 
                    title: item.title, 
                    body: item.description, 
                    timeAgo: item.createdAt 
                }) 
            }}
        >
            <Image
                style={styles.cardImage}
                source={{ uri: item.url ?? "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400" }}
            />
            <View style={styles.cardContent}>
                <View style={styles.badgeRow}>
                    <View style={styles.liveBadge}>
                        <View style={styles.dot} />
                        <Text style={styles.liveText}>UPDATE</Text>
                    </View>
                    <Text style={styles.timeText}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </Text>
                </View>
                <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.itemSubtitle} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* --- HEADER (Consistent Curved Style) --- */}
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={26} color="#FFF" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>News Feed</Text>
                        <Text style={styles.headerSubtitle}>Verified Crisis Updates</Text>
                    </View>
                    <TouchableOpacity onPress={() => fetchNews()} style={styles.headerAction}>
                        <Ionicons name="reload" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color={GREEN} />
                </View>
            ) : (
                <FlatList
                    data={news}
                    keyExtractor={(g) => g.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listPadding}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GREEN} />
                    }
                    ListHeaderComponent={
                        <View style={styles.featuredSection}>
                            <Text style={styles.sectionHeading}>LATEST STORIES</Text>
                            <View style={styles.headingUnderline} />
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="newspaper-outline" size={50} color="#CCC" />
                            <Text style={styles.emptyText}>No news bulletins available at the moment.</Text>
                        </View>
                    }
                />
            )}

            <CreateGroupModal
                visible={loadCreateGroupModal}
                onClose={() => { setLoadCreateGroupModal(false) }}
                onAddMembers={() => { }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },
    headerContainer: { 
        backgroundColor: GREEN, paddingTop: 60, paddingBottom: 25, 
        borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 8 
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
    backButton: { marginRight: 15, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 6 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase' },
    headerAction: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 8 },

    centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listPadding: { paddingHorizontal: 20, paddingBottom: 40 },
    
    featuredSection: { marginTop: 25, marginBottom: 15 },
    sectionHeading: { fontSize: 11, fontWeight: '900', color: GREEN, letterSpacing: 1.5 },
    headingUnderline: { width: 40, height: 3, backgroundColor: GREEN, marginTop: 4, borderRadius: 2 },

    newsCard: { 
        backgroundColor: '#FFF', borderRadius: 24, marginBottom: 20, 
        elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
        overflow: 'hidden', borderWidth: 1, borderColor: '#EEE'
    },
    cardImage: { width: '100%', height: 180 },
    cardContent: { padding: 16 },
    badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN, marginRight: 6 },
    liveText: { fontSize: 9, fontWeight: '900', color: GREEN },
    timeText: { fontSize: 11, color: '#999', fontWeight: '600' },
    
    itemTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', lineHeight: 24, marginBottom: 8 },
    itemSubtitle: { fontSize: 13, color: '#666', lineHeight: 18 },

    emptyContainer: { padding: 60, alignItems: 'center' },
    emptyText: { color: '#999', marginTop: 15, fontSize: 14, textAlign: 'center', lineHeight: 20 }
});

export default NewsListing;