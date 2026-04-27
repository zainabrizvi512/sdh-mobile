import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

type PostDisasterFrameworkTimelinePayload = {
  incidentId: string;
  description: string;
  [key: string]: any;
};

export const postDisasterFrameworkTimeline = async (
  token: string,
  payload: PostDisasterFrameworkTimelinePayload
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/disaster-framework/timeline`,
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
    console.log("postDisasterFrameworkTimeline error", error?.response?.data || error?.message);
    throw error;
  }
};
