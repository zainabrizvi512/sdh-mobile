import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export const getRescueAnalytics = async (token: string) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/rescue/analytics`;
    const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
        url,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        console.log("getRescueAnalytics error", error);
        throw error;
    }
};