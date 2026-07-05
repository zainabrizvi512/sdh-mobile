import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DataSecuritySettingsResponse = {
  encryptedStorage: {
    enabled: boolean;
    algorithm: string;
    description: string;
  };
  realtimeSync: {
    enabled: boolean;
    intervalSeconds: number;
    conflictSafe: boolean;
    offlineQueueEnabled: boolean;
  };
};

export const getDataSecuritySettings = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/settings`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DataSecuritySettingsResponse>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDataSecuritySettings error", error?.response?.data || error?.message);
    throw error;
  }
};
