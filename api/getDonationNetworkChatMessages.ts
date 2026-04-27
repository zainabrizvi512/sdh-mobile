import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DonationNetworkChatMessage = {
  id: string;
  body?: string;
  text?: string;
  content?: string;
  createdAt?: string;
  senderId?: string;
  sender?: { id?: string; name?: string };
  [key: string]: any;
};

export const getDonationNetworkChatMessages = async (token: string, ngoId: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/donation-network/chat/${encodeURIComponent(ngoId)}/messages`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DonationNetworkChatMessage[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDonationNetworkChatMessages error", error?.response?.data || error?.message);
    throw error;
  }
};
