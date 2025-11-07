import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type ApiGroupMember = {
    id: string;
    username: string | null;
    picture: string | null;
    email: string;
    isOwner: boolean;
};

export const getGroupMembers = async (token: string, groupId: string) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/groups/${groupId}/members`;
    const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
        url,
        maxBodyLength: Infinity,
    };

    try {
        const response = await axios(config);
        return response; // { data: ApiGroupMember[] }
    } catch (error: any) {
        console.log(
            "getGroupMembers error",
            error?.response?.data || error?.message
        );
        throw error;
    }
};