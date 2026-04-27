import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostDonationNetworkCampaignPayload = {
  title: string;
  description?: string;
  goalAmount?: number;
  category?: string;
  [key: string]: any;
};

export const postDonationNetworkCampaign = async (token: string, payload: PostDonationNetworkCampaignPayload) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/donation-network/campaigns`,
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
    console.log("postDonationNetworkCampaign error", error?.response?.data || error?.message);
    throw error;
  }
};
