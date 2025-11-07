// api/messages.ts
import axios, { AxiosRequestConfig } from "axios";
import { envConfig } from "../config/envConfig";

// --- Types ---
export type ApiMessageSender = {
    id: string;
    username: string;
    avatar?: string | null;
};

export type ApiMessage = {
    id: string;
    text: string;
    createdAt: string; // ISO
    sender: ApiMessageSender;
    groupId: string;
};

export type ListMessagesParams = {
    limit?: number;       // default 25
    beforeId?: string;    // fetch older
    afterId?: string;     // fetch newer
};

export type ListMessagesResponse = ApiMessage[];

// --- Service function ---
export const getChatMessages = async (
    token: string,
    groupId: string,
    params: ListMessagesParams = {}
) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/groups/${groupId}/messages`;

    const config: AxiosRequestConfig = {
        method: "GET",
        url,
        headers: { Authorization: `Bearer ${token}` },
        params: {
            limit: params.limit ?? 25,
            beforeId: params.beforeId,
            afterId: params.afterId,
        },
    };

    try {
        const response = await axios<ListMessagesResponse>(config);
        return response.data;
    } catch (error: any) {
        console.log("listGroupMessages error:", error?.response?.data || error?.message);
        throw error;
    }
};
