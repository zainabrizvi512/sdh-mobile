import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type NotificationPreferences = {
  id: string;
  emergencyAlerts: boolean;
  news: boolean;
  chatMessages: boolean;
  donationUpdates: boolean;
};

export const getNotificationPreferences = async (token: string) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/notifications/preferences`;

  const config: AxiosRequestConfig = {
    method: "GET",
    url,
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const res = await axios<NotificationPreferences>(config);
    return res.data;
  } catch (error: any) {
    console.log("getNotificationPreferences error", error?.response?.data || error?.message);
    throw error;
  }
};
