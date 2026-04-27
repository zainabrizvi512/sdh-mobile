import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

type PostDisasterFrameworkTaskPayload = {
  title: string;
  assignee: string;
  priority?: string;
  status?: string;
  [key: string]: any;
};

export const postDisasterFrameworkTask = async (token: string, payload: PostDisasterFrameworkTaskPayload) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/disaster-framework/tasks`,
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
    console.log("postDisasterFrameworkTask error", error?.response?.data || error?.message);
    throw error;
  }
};
