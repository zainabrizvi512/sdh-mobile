import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type EngagementHubHistoryItem = {
  id: string;
  title?: string;
  name?: string;
  completedAt?: string;
  endedAt?: string;
  xpEarned?: number;
  xp?: number;
  icon?: string;
  [key: string]: any;
};

export const getEngagementHubHistory = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/engagement-hub/history`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<EngagementHubHistoryItem[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getEngagementHubHistory error", error?.response?.data || error?.message);
    throw error;
  }
};
