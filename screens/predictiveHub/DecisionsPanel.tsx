import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { usePredictiveHub } from '../../store/predictiveHub.store';

export default function DecisionsPanel() {
    const decisions = usePredictiveHub(s => s.decisions);

    return (
        <ScrollView style={{ padding: 12 }}>
            {decisions.map((r: any, idx: number) => (
                <View key={idx} style={{ marginBottom: 12, padding: 12, borderWidth: 1, borderColor: '#EEE', borderRadius: 16 }}>
                    <Text style={{ fontWeight: '700', marginBottom: 6 }}>Score: {r.score} • Level: {r.level}</Text>
                    <Text style={{ marginBottom: 6 }}>Steps:</Text>
                    {r.steps?.map((s: any) => <Text key={s.id}>• {s.title || s.text}</Text>)}
                    {!!r.checklist?.length && (<>
                        <Text style={{ marginTop: 10, marginBottom: 6 }}>Checklist:</Text>
                        {r.checklist.map((c: any) => <Text key={c.id}>▢ {c.label || c.text}</Text>)}
                    </>)}
                </View>
            ))}
        </ScrollView>
    );
}
