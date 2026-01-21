import { envConfig } from '@/config/envConfig';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = envConfig.EXPO_PUBLIC_BASE_URL ?? "https://your-api.example.com"

interface Props {
  ngoId: string;
  token: string; // Pass the auth token
}

export default function VolunteerHubChat({ ngoId, token }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !ngoId) return;

    // 1. Connect to the Specific Namespace
    console.log(`${SOCKET_URL}/ngo-hub`);
      socketRef.current = io(`${SOCKET_URL}/ngo-hub`, {
          auth: { token }, // Pass token for WsAuthGuard
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelayMax: 5000,
      });

    const socket = socketRef.current;

    console.log(socket);

    socket.on('connect', () => {
      console.log('Connected to NGO Chat');
      setConnected(true);
      // 2. Join the NGO Room
      socket.emit('join_ngo', { ngoId });
    });

    // 3. Listen for History (Optional, if backend sends it)
    socket.on('history', (history: any[]) => {
      setMessages(history);
    });

    // 4. Listen for New Messages
    socket.on('new_message', (msg: any) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [ngoId, token]);

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current) return;

    // 5. Emit to the new event
    socketRef.current.emit('send_ngo_message', {
      ngoId,
      text: text.trim(),
    });

    setText('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {!connected && (
        <View style={{ padding: 10, alignItems: 'center', backgroundColor: '#FFF3E0' }}>
            <Text style={{ fontSize: 10, color: '#F57C00' }}>Connecting to secure channel...</Text>
        </View>
      )}

      <FlatList
        inverted
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => {
          // You might need user ID from props to check 'isSelf'
          // const isSelf = item.sender.id === myUserId; 
          return (
            <View style={{ marginVertical: 5 }}>
                <Text style={{ fontSize: 10, color: '#888', marginBottom: 2 }}>
                    {item.sender?.name || "Volunteer"} • {new Date(item.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </Text>
                <View style={{ 
                    backgroundColor: '#F4F7F4', 
                    padding: 10, 
                    borderRadius: 12,
                    alignSelf: 'flex-start',
                    maxWidth: '85%'
                }}>
                    <Text style={{ color: '#333' }}>{item.text}</Text>
                </View>
            </View>
          );
        }}
      />

      <View style={{ flexDirection: 'row', padding: 10, marginBottom: 15, borderTopWidth: 1, borderColor: '#EEE' }}>
        <TextInput
          style={{ flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 }}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={sendMessage} disabled={!text.trim()}>
          <Text style={{ color: '#1f3d18', fontWeight: 'bold', padding: 10 }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}