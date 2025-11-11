import { getGuide } from "@/api/getGuide";
import { GuidePhase, QuickAction, ResourceLink, SafetyGuide } from "@/api/getSafetyGuides";
import ScreenWrapper from "@/components/screenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Linking, Platform, Pressable, Text, View } from "react-native";
import { T_SAFETYGUIDEDETAIL } from "./types";

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
            <View style={{ flex: 1, backgroundColor: '#0B0F14', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ScreenWrapper>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* Header */}
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 10,
                    }}
                >
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={{ paddingHorizontal: 8, paddingVertical: 6 }}
                        hitSlop={8}
                    >
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </Pressable>
                    <Text style={{ color: "#000", fontSize: 18, fontWeight: "700" }}>{guide.title}</Text>
                </View>
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#16202C' }}>
                    <Text style={{ color: '#000', marginTop: 4 }}>
                        {guide.disasterType?.name} • {guide.regionCity ?? 'Region'} {guide.regionProvince ? `(${guide.regionProvince})` : ''}
                    </Text>
                </View>

                {/* Tabs */}
                <View style={{ flexDirection: 'row', padding: 10, gap: 8 }}>
                    <Tab label="Steps" active={tab === 'STEPS'} onPress={() => setTab('STEPS')} />
                    <Tab label="Checklist" active={tab === 'CHECKLIST'} onPress={() => setTab('CHECKLIST')} />
                    <Tab label="Quick Actions" active={tab === 'ACTIONS'} onPress={() => setTab('ACTIONS')} />
                    <Tab label="Resources" active={tab === 'RESOURCES'} onPress={() => setTab('RESOURCES')} />
                </View>

                {/* Content */}
                {tab === 'STEPS' && (
                    <View style={{ flex: 1 }}>
                        {/* phase switch */}
                        <View style={{ flexDirection: 'row', paddingHorizontal: 10, gap: 8, marginBottom: 8 }}>
                            <PhasePill label="Before" active={phase === 'BEFORE'} onPress={() => setPhase('BEFORE')} />
                            <PhasePill label="During" active={phase === 'DURING'} onPress={() => setPhase('DURING')} />
                            <PhasePill label="After" active={phase === 'AFTER'} onPress={() => setPhase('AFTER')} />
                        </View>

                        <FlatList
                            data={stepsByPhase[phase]}
                            keyExtractor={s => s.id}
                            contentContainerStyle={{ padding: 12, gap: 10 }}
                            renderItem={({ item }) => (
                                <View style={{ backgroundColor: '#121821', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1E2A38' }}>
                                    <Text style={{ color: '#E6EEF8', fontWeight: '700', fontSize: 15 }}>{item.title}</Text>
                                    <Text style={{ color: '#9FB0C6', marginTop: 6, lineHeight: 20 }}>{item.body}</Text>
                                </View>
                            )}
                            ListEmptyComponent={<Empty label="No steps provided for this phase yet." />}
                        />
                    </View>
                )}

                {tab === 'CHECKLIST' && (
                    <FlatList
                        data={guide.checklist?.slice().sort((a, b) => a.order - b.order) ?? []}
                        keyExtractor={c => c.id}
                        contentContainerStyle={{ padding: 12, gap: 10 }}
                        renderItem={({ item }) => {
                            const on = !!checked[item.id];
                            return (
                                <Pressable
                                    onPress={() => setChecked(prev => ({ ...prev, [item.id]: !on }))}
                                    style={{
                                        backgroundColor: on ? '#0F1F2E' : '#121821',
                                        borderRadius: 12,
                                        padding: 14,
                                        borderWidth: 1,
                                        borderColor: on ? '#1D9BF0' : '#1E2A38',
                                    }}
                                >
                                    <Text style={{ color: '#E6EEF8', fontWeight: '700' }}>
                                        {on ? '✅ ' : '⬜ '} {item.label}
                                    </Text>
                                    {item.recommended && (
                                        <Text style={{ color: '#56D364', marginTop: 4, fontSize: 12 }}>Recommended</Text>
                                    )}
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
                        contentContainerStyle={{ padding: 12, gap: 10 }}
                        renderItem={({ item }) => <QuickActionRow action={item} />}
                        ListEmptyComponent={<Empty label="No quick actions yet." />}
                    />
                )}

                {tab === 'RESOURCES' && (
                    <FlatList
                        data={guide.resources?.slice().sort((a, b) => a.order - b.order) ?? []}
                        keyExtractor={r => r.id}
                        contentContainerStyle={{ padding: 12, gap: 10 }}
                        renderItem={({ item }) => <ResourceRow res={item} />}
                        ListEmptyComponent={<Empty label="No resources yet." />}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
                backgroundColor: active ? '#1D9BF0' : '#141A22', borderWidth: 1,
                borderColor: active ? '#1D9BF0' : '#223042'
            }}>
            <Text style={{ color: active ? '#fff' : '#B9C7D8', fontWeight: '700' }}>{label}</Text>
        </Pressable>
    );
}

function PhasePill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
                backgroundColor: active ? '#0E7DD9' : '#141A22',
                borderWidth: 1, borderColor: active ? '#0E7DD9' : '#223042',
            }}>
            <Text style={{ color: active ? '#fff' : '#B9C7D8', fontWeight: '700' }}>{label}</Text>
        </Pressable>
    );
}

function QuickActionRow({ action }: { action: QuickAction }) {
    const onPress = () => {
        switch (action.type) {
            case 'CALL':
                if (action.payload) Linking.openURL(`tel:${action.payload}`);
                break;
            case 'SMS':
                if (action.payload) Linking.openURL(`sms:&body=${encodeURIComponent(action.payload)}`);
                break;
            case 'URL':
                if (action.payload) Linking.openURL(action.payload);
                break;
            case 'MAP':
                if (action.payload) {
                    const url = Platform.select({
                        ios: `http://maps.apple.com/?q=${encodeURIComponent(action.payload)}`,
                        android: `geo:0,0?q=${encodeURIComponent(action.payload)}`,
                    });
                    if (url) Linking.openURL(url);
                }
                break;
            default:
                break;
        }
    };

    return (
        <Pressable
            onPress={onPress}
            style={{
                backgroundColor: '#121821',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: '#1E2A38'
            }}
        >
            <Text style={{ color: '#E6EEF8', fontWeight: '700' }}>{action.label}</Text>
            <Text style={{ color: '#9FB0C6', marginTop: 4, fontSize: 12 }}>{action.type}{action.payload ? ` • ${action.payload}` : ''}</Text>
        </Pressable>
    );
}

function ResourceRow({ res }: { res: ResourceLink }) {
    return (
        <Pressable
            onPress={() => Linking.openURL(res.url)}
            style={{
                backgroundColor: '#121821',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: '#1E2A38'
            }}
        >
            <Text style={{ color: '#E6EEF8', fontWeight: '700' }}>{res.title}</Text>
            <Text style={{ color: '#9FB0C6', marginTop: 4, fontSize: 12 }}>{res.source ?? new URL(res.url).hostname}</Text>
        </Pressable>
    );
}

function Empty({ label }: { label: string }) {
    return (
        <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: '#72849A' }}>{label}</Text>
        </View>
    );

}

export default SafetyGuideDetail;