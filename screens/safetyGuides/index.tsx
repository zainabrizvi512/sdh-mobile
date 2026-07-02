import { getDisasterTypes } from "@/api/getDisasterTypes";
import { getSafetyGuides, SafetyGuide } from "@/api/getSafetyGuides";
import FancyAppHeader from "@/components/fancyAppHeader";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { T_SAFETYGUIDES } from "./types";

const GREEN = "#1f3d18";
const BG_LIGHT = "#F4F7F4";

const SafetyGuides: React.FC<T_SAFETYGUIDES> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [guides, setGuides] = useState<SafetyGuide[]>([]);
    const [q, setQ] = useState("");
    const [city, setCity] = useState("Islamabad"); 
    const [disaster, setDisaster] = useState<string | undefined>(undefined);
    const [types, setTypes] = useState<{ slug: string; name: string }[]>([]);

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const filtered = useMemo(() => guides, [guides]);

    const load = async () => {
        try {
            setLoading(true);
            const [t, g] = await Promise.all([
                getDisasterTypes(),
                getSafetyGuides({ city, disaster, q, published: true }),
            ]);
            setTypes(t.map((x) => ({ slug: x.slug, name: x.name })));
            setGuides(g);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [city, disaster, q]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <FancyAppHeader
                title="Safety Guides"
                subtitle="Proactive emergency prep & disaster protocols"
                badge={{ icon: "shield-checkmark", label: "PREPAREDNESS" }}
                onBack={() => navigation.goBack()}
                footer={
                    <View style={styles.searchContainer}>
                        <View style={styles.searchBox}>
                            <Ionicons name="search" size={18} color="#999" style={{ marginRight: 8 }} />
                            <TextInput
                                placeholder="Search title…"
                                placeholderTextColor="#999"
                                value={q}
                                onChangeText={setQ}
                                style={styles.input}
                            />
                        </View>
                        <View style={[styles.searchBox, { width: 110, marginLeft: 10 }]}>
                            <Ionicons name="location" size={18} color={GREEN} style={{ marginRight: 4 }} />
                            <TextInput
                                placeholder="City"
                                placeholderTextColor="#999"
                                value={city}
                                onChangeText={setCity}
                                style={styles.input}
                            />
                        </View>
                    </View>
                }
            />

            {/* --- BODY --- */}
            <View style={styles.body}>
                {/* Disaster Filters Scrollable Pills */}
                <View style={styles.filterWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        <FilterPill label="All Disasters" active={!disaster} onPress={() => setDisaster(undefined)} />
                        {types.map((t) => (
                            <FilterPill
                                key={t.slug}
                                label={t.name}
                                active={disaster === t.slug}
                                onPress={() => setDisaster(t.slug)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {loading ? (
                    <View style={styles.centerLoader}>
                        <ActivityIndicator color={GREEN} size="large" />
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(g) => g.id}
                        contentContainerStyle={styles.listPadding}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => navigation.navigate("SafetyGuideDetail", { id: item.id, title: item.title })}
                                style={styles.guideCard}
                            >
                                <View style={styles.cardTop}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeBadgeText}>{item.disasterType?.name}</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.cardBottom}>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="map-outline" size={14} color="#666" />
                                        <Text style={styles.infoText}>
                                            {item.regionCity ?? "Region"} {item.regionProvince ? `(${item.regionProvince})` : ""}
                                        </Text>
                                    </View>
                                    <Text style={styles.dateText}>
                                        Updated: {new Date(item.updatedAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#CCC" style={styles.arrow} />
                            </Pressable>
                        )}
                        ListEmptyComponent={<Empty label="No safety guides found." />}
                    />
                )}
            </View>
        </View>
    );
};

// --- HELPER COMPONENTS ---

function FilterPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
            <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
        </Pressable>
    );
}

function Empty({ label }: { label: string }) {
    return (
        <View style={styles.centerLoader}>
            <Ionicons name="document-text-outline" size={40} color="#CCC" />
            <Text style={{ color: "#999", marginTop: 10 }}>{label}</Text>
        </View>
    );
}

// --- STYLES ---

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },

    searchContainer: { flexDirection: 'row' },
    searchBox: { 
        flex: 1, flexDirection: 'row', alignItems: 'center', 
        backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 
    },
    input: { flex: 1, color: '#000', fontSize: 14, fontWeight: '600' },
    
    body: { flex: 1 },
    filterWrapper: { paddingVertical: 15, paddingHorizontal: 20 },
    pill: { 
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, 
        backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE' 
    },
    pillActive: { backgroundColor: GREEN, borderColor: GREEN },
    pillText: { color: GREEN, fontWeight: '700', fontSize: 12 },
    pillTextActive: { color: '#FFF' },
    
    centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listPadding: { paddingHorizontal: 20, paddingBottom: 30 },
    
    guideCard: { 
        backgroundColor: '#FFF', borderRadius: 20, padding: 18, 
        marginBottom: 12, elevation: 3, shadowColor: '#000', 
        shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#EEE' 
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardTitle: { fontSize: 16, fontWeight: '800', color: '#333', flex: 1, marginRight: 10 },
    typeBadge: { backgroundColor: '#F0F4F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    typeBadgeText: { color: GREEN, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
    
    cardBottom: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoText: { fontSize: 12, color: '#666', marginLeft: 4, fontWeight: '600' },
    dateText: { fontSize: 11, color: '#999' },
    arrow: { position: 'absolute', right: 15, bottom: 20, opacity: 0.5 }
});

export default SafetyGuides;