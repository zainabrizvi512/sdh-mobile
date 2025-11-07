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
    showStatus?: boolean;        // double-check ticks for "me"
    dateTag?: "Today" | null;
    tempId?: string;             // optimistic id before server id arrives
};

export type ServerUser = {
    id: string;
    username: string;
    picture?: string | null;
};

export type ServerMessage = {
    id: string;
    text: string;
    createdAt: string; // ISO string
    sender: ServerUser;
    groupId: string;
};

export type SendMessageDto = {
    text: string;
    // extend if you support images, attachments, replyTo, etc.
};
