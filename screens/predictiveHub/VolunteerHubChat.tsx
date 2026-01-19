import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePredictiveHub } from '../../store/predictiveHub.store';

export default function VolunteerHubChat() {
    const messages = usePredictiveHub(s => s.messages);
    const socket = usePredictiveHub(s => s.socket);
    const region = usePredictiveHub(s => s.region);
    const [text, setText] = useState('');

    function send() {
        if (!text.trim() || !socket) return;
        // Reuse your server's message channel; use group-less "hub" with kind='volunteer'
        socket.emit('send_message', { groupId: '', dto: { type: 'TEXT', text, kind: 'volunteer', meta: { region } } });
        setText('');
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                inverted
                data={messages}
                keyExtractor={(m: any, i: number) => m.id || String(i)}
                renderItem={({ item }) => (
                    <View style={{ padding: 8 }}>
                        <Text style={{ fontSize: 12, color: '#666' }}>{new Date(item.createdAt || Date.now()).toLocaleTimeString()}</Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View style={{ flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: '#EEE' }}>
                <TextInput style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 12, marginRight: 8 }} placeholder="Share update…" value={text} onChangeText={setText} />
                <TouchableOpacity onPress={send}><Text style={{ padding: 12, fontWeight: '700' }}>Send</Text></TouchableOpacity>
            </View>
        </View>
    );
}
