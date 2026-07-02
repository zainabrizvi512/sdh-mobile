import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DataSecuritySyncStatusResponse = {
  status: string;
  enabled: boolean;
  intervalSeconds: number;
  conflictSafe: boolean;
  offlineQueueEnabled: boolean;
  pendingQueueItems: number;
};

export const getDataSecuritySyncStatus = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/sync/status`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DataSecuritySyncStatusResponse>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDataSecuritySyncStatus error", error?.response?.data || error?.message);
    throw error;
  }
};
