import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DonationNetworkChatContact = {
  id: string;
  ngoId?: string;
  name?: string;
  title?: string;
  organizationName?: string;
  online?: boolean;
  [key: string]: any;
};

export const getDonationNetworkChatContacts = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/donation-network/chat/contacts`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DonationNetworkChatContact[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDonationNetworkChatContacts error", error?.response?.data || error?.message);
    throw error;
  }
};
