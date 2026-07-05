import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type MentalHealthNgo = {
  id: string;
  name: string;
  description: string;
  helpline?: string | null;
  websiteUrl?: string | null;
};

export const getMentalHealthNgos = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/mental-health/ngos`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<{ ngos: MentalHealthNgo[] }>(config);
    return response.data;
  } catch (error: any) {
    console.log("getMentalHealthNgos error", error?.response?.data || error?.message);
    throw error;
  }
};
