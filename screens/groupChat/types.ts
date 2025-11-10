import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_GROUPCHAT = NativeStackScreenProps<
    DashboardStackParamList,
    "GroupChat"
>;

export type GroupChatRouteParams = {
    name: string;
    members: number;
    avatar: string;
    id: string;
};

export type Sender = "me" | "other";

export type UiMessage = {
    id: string;
    text: string;
    createdAt: string;
    sender: Sender;
    username?: string;
    picture?: string;
    showStatus?: boolean;
    dateTag?: "Today" | null;
    tempId?: string;
    kind: MessageKind;
    location?: LocationPayload;
    attachments?: Attachment[];                 // NEW
};

export type ServerUser = {
    id: string;
    username: string;
    picture?: string | null;
};

export type ServerMessage = {
    id: string;
    text: string;
    createdAt: string;
    sender: ServerUser;
    groupId: string;
    location?: LocationPayload;
    kind: MessageKind;                          // now can be "audio"
    attachments?: Attachment[];                 // NEW
};

export type MessageKind = "text" | "location" | "system" | "audio" | "image";

/** GPS payload sent/received when kind === "location" */
export type LocationPayload = {
    lat: number;
    lng: number;
    accuracy?: number; // meters (optional)
};

/** Client → server when sending anything (text or location) */
export type SendMessageDto = {
    kind: MessageKind;         // "text" | "location" | "audio"
    text?: string;
    location?: LocationPayload;
    attachments?: Attachment[];                 // for audio
};

export type Attachment = {
    url: string;
    mime?: string;
    durationMs?: number;
    width?: number;
    height?: number;
};