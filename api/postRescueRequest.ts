import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export interface CreateRequestPayload {
    resourceType: string;
    quantity: number;
}

export const postRescueRequest = async (token: string, payload: CreateRequestPayload) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/rescue/requests`;
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
        console.log("createRescueRequest error", error);
        throw error;
    }
};