import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = envConfig.EXPO_PUBLIC_BASE_URL;

export const getDecisionsByRegion = async (region: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${BASE_URL}/decisions/${region}`,
  };

  try {
    const response = await axios<any[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDecisionsByRegion error", error?.response?.data || error?.message);
    throw error;
  }
};