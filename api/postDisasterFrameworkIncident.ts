import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

type PostDisasterFrameworkIncidentPayload = {
  title: string;
  location?: string;
  severity?: string;
  [key: string]: any;
};

export const postDisasterFrameworkIncident = async (
  token: string,
  payload: PostDisasterFrameworkIncidentPayload
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/disaster-framework/incidents`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: payload,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.log("postDisasterFrameworkIncident error", error?.response?.data || error?.message);
    throw error;
  }
};
