import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
};

export const getNotifications = async (token: string, unreadOnly?: boolean) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/notifications${unreadOnly ? "?unreadOnly=true" : ""}`;

  const config: AxiosRequestConfig = {
    method: "GET",
    url,
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const res = await axios<AppNotification[]>(config);
    return res.data;
  } catch (error: any) {
    console.log("getNotifications error", error?.response?.data || error?.message);
    throw error;
  }
};
