import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DonationNetworkStory = {
  id: string;
  author?: string;
  authorName?: string;
  body?: string;
  content?: string;
  text?: string;
  createdAt?: string;
  [key: string]: any;
};

export const getDonationNetworkStories = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/donation-network/stories`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DonationNetworkStory[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDonationNetworkStories error", error?.response?.data || error?.message);
    throw error;
  }
};
