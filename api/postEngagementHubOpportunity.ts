import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostEngagementHubOpportunityPayload = {
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  [key: string]: any;
};

export const postEngagementHubOpportunity = async (
  token: string,
  payload: PostEngagementHubOpportunityPayload
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/engagement-hub/opportunities`,
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
    console.log("postEngagementHubOpportunity error", error?.response?.data || error?.message);
    throw error;
  }
};
