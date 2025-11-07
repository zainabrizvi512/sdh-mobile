// api/groups.ts
import axios, { AxiosRequestConfig } from "axios";
import { envConfig } from "../config/envConfig";

export type ApiGroup = {
    id: string;
    name: string;
    picture?: string | null;
    type?: string;
    // Depending on your backend response:
    members?: Array<{ id: string }>;
    owner?: { id: string };
    membersCount?: number; // if you decide to return a precomputed count
};

export const getMyGroups = async (token: string) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/groups`;
    const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
        url,
        maxBodyLength: Infinity,
    };

    try {
        const response = await axios(config);
        return response; // keep same return shape as your getLoggedInUser
    } catch (error: any) {
        console.log("getMyGroups error", error?.response?.data || error?.message);
        throw error;
    }
};
