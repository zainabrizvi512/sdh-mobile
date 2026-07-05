import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type EngagementHubDashboardResponse = {
  displayName?: string;
  name?: string;
  rank?: string;
  level?: number;
  currentXp?: number;
  maxXp?: number;
  missionsCount?: number;
  missions?: number;
  livesImpacted?: number;
  livesImpactedLabel?: string;
  [key: string]: any;
};

export const getEngagementHubDashboard = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/engagement-hub/dashboard`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<EngagementHubDashboardResponse>(config);
    return response.data;
  } catch (error: any) {
    console.log("getEngagementHubDashboard error", error?.response?.data || error?.message);
    throw error;
  }
};
