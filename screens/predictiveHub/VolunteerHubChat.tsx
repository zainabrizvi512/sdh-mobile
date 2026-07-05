import { envConfig } from '@/config/envConfig';
import { BOTTOM_NAV_SCROLL_PADDING } from '@/components/bottomNav/styles';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = envConfig.EXPO_PUBLIC_BASE_URL ?? "https://your-api.example.com"

interface Props {
  ngoId: string;
  token: string;
  currentUserId: string; // <--- Add this Prop
}

export default function VolunteerHubChat({ ngoId, token, currentUserId }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !ngoId) return;

    socketRef.current = io(`${SOCKET_URL}/ngo-hub`, {
          auth: { token },
          transports: ['websocket'],
          reconnection: true,
      });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to NGO Chat');
      setConnected(true);
      socket.emit('join_ngo', { ngoId });
    });

    socket.on('history', (history: any[]) => {
      setMessages(history);
    });

    socket.on('new_message', (msg: any) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [ngoId, token]);

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current) return;
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
            <Text style={{ fontSize: 10, color: '#F57C00' }}>Connecting...</Text>
        </View>
      )}

      <FlatList
        inverted
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => {
          // Check if the message was sent by the logged-in user
          const isSelf = item.sender?.id === currentUserId;

          return (
            <View style={{ 
                marginVertical: 5, 
                alignSelf: isSelf ? 'flex-end' : 'flex-start', // Right for self, Left for others
                maxWidth: '80%' 
            }}>
                {/* Only show sender name for others */}
                {!isSelf && (
                    <Text style={{ fontSize: 10, color: '#888', marginBottom: 2, marginLeft: 4 }}>
                        {item.sender?.name || "Volunteer"}
                    </Text>
                )}

                <View style={{ 
                    backgroundColor: isSelf ? '#0f4c3a' : '#F4F7F4', // Dark Green for Self, Light Grey for Others
                    padding: 12, 
                    borderRadius: 16,
                    borderBottomRightRadius: isSelf ? 2 : 16, // Chat bubble effect
                    borderBottomLeftRadius: isSelf ? 16 : 2,
                }}>
                    <Text style={{ color: isSelf ? '#FFF' : '#333' }}>{item.text}</Text>
                </View>
                
                <Text style={{ 
                    fontSize: 9, 
                    color: '#999', 
                    marginTop: 2, 
                    alignSelf: isSelf ? 'flex-end' : 'flex-start',
                    marginRight: isSelf ? 4 : 0,
                    marginLeft: isSelf ? 0 : 4
                }}>
                    {new Date(item.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </Text>
            </View>
          );
        }}
      />

      <View style={{ flexDirection: 'row', padding: 10, marginBottom: BOTTOM_NAV_SCROLL_PADDING, borderTopWidth: 1, borderColor: '#EEE' }}>
        <TextInput
          style={{ flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 }}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={sendMessage} disabled={!text.trim()}>
          <Text style={{ color: '#0f4c3a', fontWeight: 'bold', padding: 10 }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}