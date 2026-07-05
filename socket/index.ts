// src/lib/chatSocket.ts
import { envConfig } from "@/config/envConfig";
import { io, Socket } from "socket.io-client";

type CreateSocketArgs = {
    baseUrl: string;
    token?: string | null;
};

let socketRef: Socket | null = null;

export function createChatSocket({ baseUrl, token }: CreateSocketArgs) {
    if (socketRef?.connected) return socketRef;
    socketRef = io(`${envConfig.EXPO_PUBLIC_BASE_URL}/chat`, {
        transports: ["websocket"],       // Faster on RN
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelayMax: 5000,
        auth: token ? { token } : undefined, // Will be available at socket.handshake.auth.token
        // If your guard expects "Authorization: Bearer <token>" header instead,
        // use 'extraHeaders' (Android only; iOS drops custom headers on WS).
        // extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return socketRef;
}

export function getChatSocket() {
    return socketRef;
}

export function destroyChatSocket() {
    try {
        socketRef?.removeAllListeners();
        socketRef?.disconnect();
    } finally {
        socketRef = null;
    }
}

let singleton: Socket | undefined;

export function getSocket(opts?: { query?: Record<string,string>; auth?: any }) {
  if (singleton && singleton.connected) return singleton;
  const url = (process.env.EXPO_PUBLIC_WS || process.env.EXPO_PUBLIC_API || 'http://localhost:3000') + '/chat';
  singleton = io(url, { transports: ['websocket'], query: opts?.query, auth: opts?.auth });
  return singleton;
}

export function closeSocket() {
  if (singleton) { singleton.disconnect(); singleton = undefined; }
}
