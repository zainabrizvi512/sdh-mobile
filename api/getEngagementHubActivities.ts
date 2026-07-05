import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type EngagementHubActivity = {
  id: string;
  title?: string;
  name?: string;
  status?: string;
  description?: string;
  [key: string]: any;
};

export const getEngagementHubActivities = async (token: string, status: string = "IN_PROGRESS") => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/engagement-hub/activities?status=${encodeURIComponent(status)}`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<EngagementHubActivity[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getEngagementHubActivities error", error?.response?.data || error?.message);
    throw error;
  }
};
