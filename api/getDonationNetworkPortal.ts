import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DonationNetworkPortalResponse = {
  headline?: string;
  summary?: string;
  suggestedAmounts?: number[];
  [key: string]: any;
};

export const getDonationNetworkPortal = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/donation-network/portal`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DonationNetworkPortalResponse>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDonationNetworkPortal error", error?.response?.data || error?.message);
    throw error;
  }
};
