import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export interface CreateFeedbackPayload {
    observation: string;
}

export const postRescueFeedback = async (token: string, payload: CreateFeedbackPayload) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/rescue/feedback`;
    const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        url,
        data: payload,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        console.log("submitRescueFeedback error", error);
        throw error;
    }
};