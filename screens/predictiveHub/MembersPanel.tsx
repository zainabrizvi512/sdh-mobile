import { envConfig } from '@/config/envConfig';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API = envConfig.EXPO_PUBLIC_BASE_URL || 'http://localhost:3000';

export default function MembersPanel() {
    const [members, setMembers] = useState<any[]>([]);
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState<'member' | 'moderator' | 'admin'>('member');
    const groupId = ''; // wire your selected hub group here if applicable

    async function refresh() {
        if (!groupId) return;
        const res = await fetch(`${API}/groups/${groupId}/members`);
        const data = await res.json();
        setMembers(data);
    }
    async function upsert() {
        if (!groupId || !userId) return;
        await fetch(`${API}/groups/${groupId}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, role }) });
        setUserId(''); refresh();
    }

    useEffect(() => { refresh(); }, [groupId]);

    return (
        <View style={{ flex: 1, padding: 12 }}>
            <FlatList data={members} keyExtractor={(m: any) => m.userId} renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#EEE' }}>
                    <Text>{item.userId.slice(0, 8)}…</Text><Text>{item.role}</Text>
                </View>
            )} />
            <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: '700', marginBottom: 8 }}>Add / Update Member</Text>
                <TextInput placeholder="userId" value={userId} onChangeText={setUserId} style={{ borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 10, marginBottom: 8 }} />
                <View style={{ flexDirection: 'row' }}>
                    {(['member', 'moderator', 'admin'] as const).map(r => (
                        <TouchableOpacity key={r} onPress={() => setRole(r)}>
                            <Text style={{ marginRight: 14, fontWeight: role === r ? '700' : '400' }}>{r}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity onPress={upsert}><Text style={{ padding: 12, fontWeight: '700' }}>Save</Text></TouchableOpacity>
            </View>
        </View>
    );
}
