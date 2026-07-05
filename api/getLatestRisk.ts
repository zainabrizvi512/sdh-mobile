import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type RiskSnapshot = {
  id?: string;
  disasterTypeId: string;
  disasterName?: string;
  score: number;
  features: Record<string, any>;
  createdAt?: string;
};

const BASE_URL = envConfig.EXPO_PUBLIC_BASE_URL;

export const getLatestRisk = async (region: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${BASE_URL}/risk/latest/${region}`,
  };

  try {
    const response = await axios<RiskSnapshot[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getLatestRisk error", error?.response?.data || error?.message);
    throw error;
  }
};
