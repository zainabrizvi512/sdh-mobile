import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostDonationNetworkChatMessagePayload = {
  ngoId: string;
  text?: string;
  body?: string;
  content?: string;
  [key: string]: any;
};

export const postDonationNetworkChatMessage = async (
  token: string,
  payload: PostDonationNetworkChatMessagePayload
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/donation-network/chat/messages`,
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
    console.log("postDonationNetworkChatMessage error", error?.response?.data || error?.message);
    throw error;
  }
};
