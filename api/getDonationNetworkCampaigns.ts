import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DonationNetworkCampaign = {
  id: string;
  title?: string;
  name?: string;
  goal?: number;
  goalAmount?: number;
  raised?: number;
  raisedAmount?: number;
  category?: string;
  progressPercent?: number;
  [key: string]: any;
};

export const getDonationNetworkCampaigns = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/donation-network/campaigns`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DonationNetworkCampaign[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDonationNetworkCampaigns error", error?.response?.data || error?.message);
    throw error;
  }
};
