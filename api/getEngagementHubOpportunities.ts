import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type EngagementHubOpportunity = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  distanceKm?: number;
  [key: string]: any;
};

export type GetEngagementHubOpportunitiesParams = {
  latitude: number;
  longitude: number;
  radiusKm?: number;
};

export const getEngagementHubOpportunities = async (
  token: string,
  params: GetEngagementHubOpportunitiesParams
) => {
  const radius = params.radiusKm ?? 5;
  const qs = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    radiusKm: String(radius),
  }).toString();

  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/engagement-hub/opportunities?${qs}`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<EngagementHubOpportunity[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getEngagementHubOpportunities error", error?.response?.data || error?.message);
    throw error;
  }
};
