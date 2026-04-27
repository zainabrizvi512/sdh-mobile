import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

type PostDisasterFrameworkCommunicationPayload = {
  message: string;
  channel?: string;
  [key: string]: any;
};

export const postDisasterFrameworkCommunication = async (
  token: string,
  payload: PostDisasterFrameworkCommunicationPayload
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/disaster-framework/communication`,
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
    console.log("postDisasterFrameworkCommunication error", error?.response?.data || error?.message);
    throw error;
  }
};
