import axios, { AxiosRequestConfig } from "axios";
import { envConfig } from "../config/envConfig";

export const getAllNews = async (token: string) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/news`;
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        maxBodyLength: Infinity,
        method: "GET",
        url,
    };

    try {
        const response = await axios(config);
        return response;
    } catch (error: any) {
        console.log("error", error);
        throw error;
    }
};
