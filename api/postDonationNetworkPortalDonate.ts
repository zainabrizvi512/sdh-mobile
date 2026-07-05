import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostDonationNetworkPortalDonatePayload = {
  amount: number;
  currency?: string;
  campaignId?: string;
  paymentMethodId?: string;
  [key: string]: any;
};

export const postDonationNetworkPortalDonate = async (
  token: string,
  payload: PostDonationNetworkPortalDonatePayload
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/donation-network/portal/donate`,
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
    console.log("postDonationNetworkPortalDonate error", error?.response?.data || error?.message);
    throw error;
  }
};
