import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type MentalHealthStressTip = {
  id: string;
  title: string;
  body?: string | null;
};

export const getMentalHealthStressTips = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/mental-health/stress-tips`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<{ tips: MentalHealthStressTip[] }>(config);
    return response.data;
  } catch (error: any) {
    console.log("getMentalHealthStressTips error", error?.response?.data || error?.message);
    throw error;
  }
};
