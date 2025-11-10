// api/postChatAudio.ts
import axios, { AxiosRequestConfig } from "axios";
import { envConfig } from "../config/envConfig";

export const postChatAudio = async (
    fileUri: string,
    mime: string,
    token: string,
    groupId: string
) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/groups/rest/${groupId}/messages`;

    // Build FormData payload
    const formData = new FormData();
    formData.append("audio", {
        uri: fileUri,
        name: `voice-${Date.now()}.m4a`,
        type: mime,
    } as any);
    formData.append("type", "audio"); // important: backend expects MessageType

    const config: AxiosRequestConfig = {
        method: "POST",
        url,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        data: formData,
        maxBodyLength: Infinity,
    };

    try {
        const response = await axios(config);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log("postChatAudio error", error.response?.data || error.message);
        } else {
            console.log("postChatAudio unexpected error", error);
        }
        throw error;
    }
};
