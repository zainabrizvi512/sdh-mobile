import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DisasterFrameworkDashboardResponse = {
  activeIncidents: number;
  responders: number;
  sector?: string;
  [key: string]: any;
};

export const getDisasterFrameworkDashboard = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/disaster-framework/dashboard`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DisasterFrameworkDashboardResponse>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDisasterFrameworkDashboard error", error?.response?.data || error?.message);
    throw error;
  }
};
