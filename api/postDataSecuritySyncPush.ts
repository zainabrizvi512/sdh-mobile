import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostDataSecuritySyncPushPayload = {
  entityType: string;
  entityId?: string;
  payload: Record<string, unknown>;
  version?: number;
};

export const postDataSecuritySyncPush = async (token: string, payload: PostDataSecuritySyncPushPayload) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/sync/push`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: payload,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.log("postDataSecuritySyncPush error", error?.response?.data || error?.message);
    throw error;
  }
};
