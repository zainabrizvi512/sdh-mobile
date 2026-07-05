import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type MentalHealthSelfHelpResource = {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  contentUrl?: string | null;
  durationMinutes?: number | null;
};

export const getMentalHealthSelfHelpResources = async (token: string, type?: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/mental-health/self-help/resources`,
    headers: { Authorization: `Bearer ${token}` },
    params: type ? { type } : undefined,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<{ resources: MentalHealthSelfHelpResource[] }>(config);
    return response.data;
  } catch (error: any) {
    console.log("getMentalHealthSelfHelpResources error", error?.response?.data || error?.message);
    throw error;
  }
};
