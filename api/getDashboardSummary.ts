import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DashboardSummaryResponse = {
  risk: any[];
  hazards: any[];
  volume: any[];
};

const BASE_URL = envConfig.EXPO_PUBLIC_BASE_URL;

export const getDashboardSummary = async (region: string) => {
  console.log("Region", region);
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${BASE_URL}/dashboard/${region}`,
  };

  try {
    const response = await axios<DashboardSummaryResponse>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDashboardSummary error", error?.response?.data || error?.message);
    throw error;
  }
};