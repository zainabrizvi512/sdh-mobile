import { getDisasterTypes } from '@/api/getDisasterTypes';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePredictiveHub } from '../../store/predictiveHub.store';

const GREEN = '#0f4c3a';

const LEVEL_STYLE: Record<string, { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }> = {
    high: { color: '#D32F2F', icon: 'warning', label: 'High Risk' },
    medium: { color: '#E67E22', icon: 'alert-circle', label: 'Elevated Risk' },
    low: { color: GREEN, icon: 'checkmark-circle', label: 'Low Risk' },
};

export default function DecisionsPanel() {
    const decisions = usePredictiveHub(s => s.decisions);
    const navigation = useNavigation<any>();
    const [disasterNames, setDisasterNames] = useState<Record<string, string>>({});

    useEffect(() => {
        getDisasterTypes()
            .then(types => setDisasterNames(Object.fromEntries(types.map(t => [t.id, t.name]))))
            .catch(() => {});
    }, []);

    if (decisions.length === 0) {
        return (
            <View style={{ padding: 24, alignItems: 'center' }}>
                <Ionicons name="shield-checkmark-outline" size={32} color="#AAA" />
                <Text style={{ color: '#777', marginTop: 10, textAlign: 'center' }}>
                    No recommended actions for your region right now.
                </Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 12 }}>
            {decisions.map((r: any, idx: number) => {
                const style = LEVEL_STYLE[r.level] ?? LEVEL_STYLE.low;
                const name = disasterNames[r.disasterTypeId] ?? 'Risk';
                const guideId = r.steps?.[0]?.guideId ?? r.checklist?.[0]?.guideId;

                return (
                    <View
                        key={idx}
                        style={{
                            marginBottom: 12,
                            padding: 14,
                            borderWidth: 1,
                            borderLeftWidth: 4,
                            borderColor: '#EEE',
                            borderLeftColor: style.color,
                            borderRadius: 16,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Ionicons name={style.icon} size={18} color={style.color} />
                            <Text style={{ fontWeight: '800', marginLeft: 6, color: '#1A1A1A' }}>
                                {name} — {style.label}
                            </Text>
                        </View>
                        <Text style={{ color: '#999', fontSize: 11, fontWeight: '700', marginBottom: 8 }}>
                            SCORE {r.score}/100
                        </Text>

                        {!!r.steps?.length && (
                            <>
                                <Text style={{ fontWeight: '700', marginBottom: 6 }}>Recommended Steps</Text>
                                {r.steps.map((s: any) => (
                                    <Text key={s.id} style={{ color: '#444', marginBottom: 2 }}>• {s.title || s.text}</Text>
                                ))}
                            </>
                        )}

                        {!!r.checklist?.length && (
                            <>
                                <Text style={{ fontWeight: '700', marginTop: 10, marginBottom: 6 }}>Checklist</Text>
                                {r.checklist.map((c: any) => (
                                    <Text key={c.id} style={{ color: '#444', marginBottom: 2 }}>▢ {c.label || c.text}</Text>
                                ))}
                            </>
                        )}

                        {!!guideId && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SafetyGuideDetail', { id: guideId, title: `${name} Safety Guide` })}
                                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}
                            >
                                <Text style={{ color: GREEN, fontWeight: '700', fontSize: 13 }}>View Full Safety Guide</Text>
                                <Ionicons name="chevron-forward" size={16} color={GREEN} />
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}
        </View>
    );
}
