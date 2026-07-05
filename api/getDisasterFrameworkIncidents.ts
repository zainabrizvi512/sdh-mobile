import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DisasterFrameworkIncident = {
  id: string;
  title?: string;
  name?: string;
  status?: string;
  location?: string;
  [key: string]: any;
};

export const getDisasterFrameworkIncidents = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/disaster-framework/incidents`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DisasterFrameworkIncident[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDisasterFrameworkIncidents error", error?.response?.data || error?.message);
    throw error;
  }
};
