import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DisasterFrameworkCommunicationMessage = {
  id: string;
  message: string;
  channel?: string;
  createdAt?: string;
  sender?: string;
  [key: string]: any;
};

export const getDisasterFrameworkCommunication = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/disaster-framework/communication`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DisasterFrameworkCommunicationMessage[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDisasterFrameworkCommunication error", error?.response?.data || error?.message);
    throw error;
  }
};
