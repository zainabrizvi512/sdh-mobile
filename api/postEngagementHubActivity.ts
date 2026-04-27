import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostEngagementHubActivityPayload = {
  title?: string;
  name?: string;
  description?: string;
  status?: string;
  [key: string]: any;
};

export const postEngagementHubActivity = async (token: string, payload: PostEngagementHubActivityPayload) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/engagement-hub/activities`,
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
    console.log("postEngagementHubActivity error", error?.response?.data || error?.message);
    throw error;
  }
};
