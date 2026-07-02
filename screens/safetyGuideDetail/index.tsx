import { getGuide } from "@/api/getGuide";
import { GuidePhase, QuickAction, ResourceLink, SafetyGuide } from "@/api/getSafetyGuides";
import FancyAppHeader from "@/components/fancyAppHeader";
import ScreenWrapper from "@/components/screenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Linking,
    Platform,
    Pressable,
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
                
                <FancyAppHeader
                    title={guide.title}
                    subtitle={`${guide.disasterType?.name ?? "Guide"} • ${guide.regionCity ?? "General"}`}
                    badge={{ icon: "book", label: "SAFETY PROTOCOL" }}
                    onBack={() => navigation.goBack()}
                    tabs={[
                        { id: "STEPS", label: "STEPS", icon: "list-outline" },
                        { id: "CHECKLIST", label: "CHECKLIST", icon: "checkbox-outline" },
                        { id: "ACTIONS", label: "ACTIONS", icon: "flash-outline" },
                        { id: "RESOURCES", label: "RESOURCES", icon: "library-outline" },
                    ]}
                    activeTab={tab}
                    onTabChange={(id) => setTab(id as typeof tab)}
                />

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