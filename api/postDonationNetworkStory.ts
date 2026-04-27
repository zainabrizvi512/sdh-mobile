import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostDonationNetworkStoryPayload = {
  author?: string;
  content: string;
  title?: string;
  [key: string]: any;
};

export const postDonationNetworkStory = async (token: string, payload: PostDonationNetworkStoryPayload) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/donation-network/stories`,
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
    console.log("postDonationNetworkStory error", error?.response?.data || error?.message);
    throw error;
  }
};
