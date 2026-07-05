import { getAllNews } from "@/api/getAllNews";
import CreateGroupModal from "@/components/createGroup";
import FancyAppHeader, { fancyHeaderStyles } from "@/components/fancyAppHeader";
import { getNewsCategoryStyle, STATIC_NEWS_FEED } from "@/utils/newsDisplay";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { T_NEWSLISTING } from "./types";

const GREEN = "#0f4c3a";
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

    const displayNews = news.length > 0 ? news : STATIC_NEWS_FEED;

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        const preset = getNewsCategoryStyle(index);
        const timeLabel = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.meta ?? 'Recent');
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.newsCard}
                onPress={() => {
                    navigation?.navigate?.("NewsDetails", {
                        title: item.title,
                        body: item.description,
                        timeAgo: timeLabel,
                        category: preset.category,
                        icon: preset.icon,
                        tint: preset.tint,
                    })
                }}
            >
                <View style={[styles.cardImage, styles.cardImageIcon, { backgroundColor: preset.tint + "17" }]}>
                    <Ionicons name={preset.icon} size={32} color={preset.tint} />
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.badgeRow}>
                        <View style={[styles.liveBadge, { backgroundColor: preset.tint + "17" }]}>
                            <View style={[styles.dot, { backgroundColor: preset.tint }]} />
                            <Text style={[styles.liveText, { color: preset.tint }]}>{preset.category.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.timeText}>{timeLabel}</Text>
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
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
            
            <FancyAppHeader
                title="News Feed"
                subtitle="Verified crisis updates from trusted sources"
                badge={{ icon: "newspaper", label: "CRISIS BULLETINS" }}
                onBack={() => navigation.goBack()}
                rightElement={
                    <TouchableOpacity onPress={() => fetchNews()} style={fancyHeaderStyles.backBtn}>
                        <Ionicons name="reload" size={18} color="#FFF" />
                    </TouchableOpacity>
                }
            />

            {loading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color={GREEN} />
                </View>
            ) : (
                <FlatList
                    data={displayNews}
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
    cardImageIcon: { justifyContent: 'center', alignItems: 'center' },
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