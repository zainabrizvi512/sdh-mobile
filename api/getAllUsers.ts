// api/users.ts
import axios, { AxiosRequestConfig } from "axios";
import { envConfig } from "../config/envConfig";

export type ApiUserSummary = {
    id: string;
    username: string | null;
    email: string;
    picture: string | null;
};

export type ListUsersResponse = {
    items: ApiUserSummary[];
    total: number;
    nextOffset: number | null;
};

export type ListUsersParams = {
    q?: string;
    limit?: number;   // 1..100
    offset?: number;  // 0+
    excludeGroupId?: string;
    notInGroup?: boolean; // default false
    excludeSelf?: boolean; // default true
};

export const getAllUsers = async (token: string, params: ListUsersParams = {}) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/users`;
    const config: AxiosRequestConfig = {
        method: "GET",
        url,
        headers: { Authorization: `Bearer ${token}` },
        params: {
            ...params,
            // booleans should be serialized as strings if your backend expects "true"/"false"
            notInGroup: params.notInGroup ?? false,
            excludeSelf: params.excludeSelf ?? true,
        },
        maxBodyLength: Infinity,
    };

    try {
        const response = await axios<ListUsersResponse>(config);
        return response; // { data: { items, total, nextOffset } }
    } catch (error: any) {
        console.log("listUsers error", error?.response?.data || error?.message);
        throw error;
    }
};
