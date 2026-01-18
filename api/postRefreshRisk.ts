import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";
const BASE_URL = envConfig.EXPO_PUBLIC_BASE_URL;
export const refreshRisk = async (token: string, region: string) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${BASE_URL}/risk/refresh/${region}`,
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log("refreshRisk error", error?.response?.data || error?.message);
    throw error;
  }
};