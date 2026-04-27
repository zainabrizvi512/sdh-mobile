import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DisasterFrameworkTimelineEvent = {
  id: string;
  description: string;
  incidentId?: string;
  createdAt?: string;
  [key: string]: any;
};

export const getDisasterFrameworkTimeline = async (token: string, incidentId: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/disaster-framework/timeline?incidentId=${encodeURIComponent(incidentId)}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DisasterFrameworkTimelineEvent[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDisasterFrameworkTimeline error", error?.response?.data || error?.message);
    throw error;
  }
};
