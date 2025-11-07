// api/groups.ts
import axios, { AxiosRequestConfig } from "axios";
import { envConfig } from "../config/envConfig";

export type AddMembersDto = {
    memberIds: string[];
};

export const postMembersToGroup = async (
    token: string,
    groupId: string,
    payload: AddMembersDto
) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/groups/${groupId}/members`;
    const config: AxiosRequestConfig = {
        method: "POST",
        url,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        data: payload,
        maxBodyLength: Infinity,
    };

    try {
        const res = await axios(config);
        return res; // shape is whatever your backend returns
    } catch (error: any) {
        console.log("addMembersToGroup error", error?.response?.data || error?.message);
        throw error;
    }
};
