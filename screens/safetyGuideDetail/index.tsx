import { getGuide } from "@/api/getGuide";
import { GuidePhase, QuickAction, ResourceLink, SafetyGuide } from "@/api/getSafetyGuides";
import ScreenWrapper from "@/components/screenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { T_SAFETYGUIDEDETAIL } from "./types";

const GREEN = "#1f3d18";
const BG_LIGHT = "#F4F7F4";

const SafetyGuideDetail: React.FC<T_SAFETYGUIDEDETAIL> = ({ navigation, route }) => {
    const { id } = route.params;
    const [loading, setLoading] = useState(true);
    const [guide, setGuide] = useState<SafetyGuide | null>(null);
    const [tab, setTab] = useState<'STEPS' | 'CHECKLIST' | 'ACTIONS' | 'RESOURCES'>('STEPS');
    const [phase, setPhase] = useState<GuidePhase>('BEFORE');
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const g = await getGuide(id);
                setGuide(g);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const stepsByPhase = useMemo(() => {
        const s = guide?.steps ?? [];
        return {
            BEFORE: s.filter(x => x.phase === 'BEFORE'),
            DURING: s.filter(x => x.phase === 'DURING'),
            AFTER: s.filter(x => x.phase === 'AFTER'),
        };
    }, [guide]);

    if (loading || !guide) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator color={GREEN} size="large" />
                <Text style={{ marginTop: 10, color: GREEN, fontWeight: '600' }}>Loading Guide...</Text>
            </View>
        );
    }

    return (
        <ScreenWrapper>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                
                {/* --- HEADER (Curved & Green) --- */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerRow}>
                        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={26} color="#FFF" />
                        </Pressable>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle} numberOfLines={1}>{guide.title}</Text>
                            <Text style={styles.headerSubtitle}>
                                {guide.disasterType?.name} • {guide.regionCity ?? 'General'}
                            </Text>
                        </View>
                    </View>

                    {/* --- MAIN TABS --- */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                        <Tab label="Steps" active={tab === 'STEPS'} onPress={() => setTab('STEPS')} icon="list-outline" />
                        <Tab label="Checklist" active={tab === 'CHECKLIST'} onPress={() => setTab('CHECKLIST')} icon="checkbox-outline" />
                        <Tab label="Actions" active={tab === 'ACTIONS'} onPress={() => setTab('ACTIONS')} icon="flash-outline" />
                        <Tab label="Resources" active={tab === 'RESOURCES'} onPress={() => setTab('RESOURCES')} icon="library-outline" />
                    </ScrollView>
                </View>

                {/* --- CONTENT AREA --- */}
                <View style={styles.contentBody}>
                    {tab === 'STEPS' && (
                        <View style={{ flex: 1 }}>
                            <View style={styles.phaseContainer}>
                                <PhasePill label="Before" active={phase === 'BEFORE'} onPress={() => setPhase('BEFORE')} />
                                <PhasePill label="During" active={phase === 'DURING'} onPress={() => setPhase('DURING')} />
                                <PhasePill label="After" active={phase === 'AFTER'} onPress={() => setPhase('AFTER')} />
                            </View>

                            <FlatList
                                data={stepsByPhase[phase]}
                                keyExtractor={s => s.id}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                renderItem={({ item, index }) => (
                                    <View style={styles.stepCard}>
                                        <View style={styles.stepNumberBadge}>
                                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardTitleText}>{item.title}</Text>
                                            <Text style={styles.cardBodyText}>{item.body}</Text>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={<Empty label="No protocols for this phase." />}
                            />
                        </View>
                    )}

                    {tab === 'CHECKLIST' && (
                        <FlatList
                            data={guide.checklist?.slice().sort((a, b) => a.order - b.order) ?? []}
                            keyExtractor={c => c.id}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            renderItem={({ item }) => {
                                const on = !!checked[item.id];
                                return (
                                    <Pressable
                                        onPress={() => setChecked(prev => ({ ...prev, [item.id]: !on }))}
                                        style={[styles.checklistCard, on && styles.checklistCardActive]}
                                    >
                                        <Ionicons 
                                            name={on ? "checkbox" : "square-outline"} 
                                            size={24} 
                                            color={on ? GREEN : "#CCC"} 
                                        />
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={[styles.cardTitleText, on && { color: GREEN, textDecorationLine: 'line-through' }]}>
                                                {item.label}
                                            </Text>
                                            {item.recommended && (
                                                <Text style={styles.recommendedBadge}>HIGHLY RECOMMENDED</Text>
                                            )}
                                        </View>
                                    </Pressable>
                                );
                            }}
                            ListEmptyComponent={<Empty label="No checklist items yet." />}
                        />
                    )}

                    {tab === 'ACTIONS' && (
                        <FlatList
                            data={guide.actions?.slice().sort((a, b) => a.order - b.order) ?? []}
                            keyExtractor={a => a.id}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            renderItem={({ item }) => <QuickActionRow action={item} />}
                            ListEmptyComponent={<Empty label="No quick actions yet." />}
                        />
                    )}

                    {tab === 'RESOURCES' && (
                        <FlatList
                            data={guide.resources?.slice().sort((a, b) => a.order - b.order) ?? []}
                            keyExtractor={r => r.id}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            renderItem={({ item }) => <ResourceRow res={item} />}
                            ListEmptyComponent={<Empty label="No resources yet." />}
                        />
                    )}
                </View>
            </View>
        </ScreenWrapper>
    );
}

// --- UI COMPONENTS ---

function Tab({ label, active, onPress, icon }: { label: string; active: boolean; onPress: () => void; icon: any }) {
    return (
        <Pressable onPress={onPress} style={[styles.tabItem, active && styles.activeTabItem]}>
            <Ionicons name={icon} size={16} color={active ? GREEN : "#FFF"} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
        </Pressable>
    );
}

function PhasePill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={[styles.phasePill, active && styles.phasePillActive]}>
            <Text style={[styles.phaseLabel, active && styles.activePhaseLabel]}>{label}</Text>
        </Pressable>
    );
}

function QuickActionRow({ action }: { action: QuickAction }) {
    const icons: any = { CALL: 'call', SMS: 'chatbubble-ellipses', URL: 'globe', MAP: 'map' };
    const onPress = () => {
        switch (action.type) {
            case 'CALL': if (action.payload) Linking.openURL(`tel:${action.payload}`); break;
            case 'SMS': if (action.payload) Linking.openURL(`sms:&body=${encodeURIComponent(action.payload)}`); break;
            case 'URL': if (action.payload) Linking.openURL(action.payload); break;
            case 'MAP':
                if (action.payload) {
                    const url = Platform.select({
                        ios: `http://maps.apple.com/?q=${encodeURIComponent(action.payload)}`,
                        android: `geo:0,0?q=${encodeURIComponent(action.payload)}`,
                    });
                    if (url) Linking.openURL(url);
                }
                break;
        }
    };

    return (
        <Pressable onPress={onPress} style={styles.actionCard}>
            <View style={styles.actionIconCircle}>
                <Ionicons name={icons[action.type] || 'flash'} size={20} color={GREEN} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitleText}>{action.label}</Text>
                <Text style={styles.actionTypeText}>{action.type} • {action.payload || 'Action'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </Pressable>
    );
}

function ResourceRow({ res }: { res: ResourceLink }) {
    return (
        <Pressable onPress={() => Linking.openURL(res.url)} style={styles.actionCard}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="link" size={20} color={GREEN} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitleText}>{res.title}</Text>
                <Text style={styles.actionTypeText}>{res.source || 'External Resource'}</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={GREEN} />
        </Pressable>
    );
}

function Empty({ label }: { label: string }) {
    return (
        <View style={styles.emptyContainer}>
            <Ionicons name="information-circle-outline" size={40} color="#CCC" />
            <Text style={styles.emptyText}>{label}</Text>
        </View>
    );
}

// --- STYLES ---

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
    headerContainer: { 
        backgroundColor: GREEN, paddingTop: 60, paddingBottom: 25, 
        borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 8 
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    backButton: { marginRight: 15, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 6 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
    tabScroll: { paddingHorizontal: 20 },
    tabItem: { 
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, 
        borderRadius: 20, marginRight: 10, backgroundColor: 'rgba(255,255,255,0.1)' 
    },
    activeTabItem: { backgroundColor: '#FFF' },
    tabText: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 12 },
    activeTabText: { color: GREEN },
    
    contentBody: { flex: 1, padding: 20 },
    
    phaseContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    phasePill: { flex: 1, paddingVertical: 10, borderRadius: 25, backgroundColor: '#FFF', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    phasePillActive: { backgroundColor: GREEN, borderColor: GREEN },
    phaseLabel: { fontSize: 12, fontWeight: '800', color: GREEN },
    activePhaseLabel: { color: '#FFF' },

    stepCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 12, elevation: 2 },
    stepNumberBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    stepNumberText: { color: GREEN, fontWeight: '900', fontSize: 14 },
    
    cardTitleText: { fontSize: 15, fontWeight: '700', color: '#333' },
    cardBodyText: { fontSize: 13, color: '#666', marginTop: 6, lineHeight: 18 },

    checklistCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18, padding: 16, marginBottom: 10, elevation: 2, borderWidth: 1, borderColor: '#EEE' },
    checklistCardActive: { borderColor: GREEN, backgroundColor: '#F9FFF9' },
    recommendedBadge: { fontSize: 9, fontWeight: '900', color: GREEN, marginTop: 4, letterSpacing: 0.5 },

    actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18, padding: 14, marginBottom: 10, elevation: 2 },
    actionIconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    actionTypeText: { fontSize: 11, color: '#999', marginTop: 2, textTransform: 'uppercase' },

    emptyContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: '#999', marginTop: 10, fontSize: 14, textAlign: 'center' }
});

export default SafetyGuideDetail;