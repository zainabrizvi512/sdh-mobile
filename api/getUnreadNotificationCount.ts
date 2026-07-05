import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export const getUnreadNotificationCount = async (token: string) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/notifications/unread-count`;

  const config: AxiosRequestConfig = {
    method: "GET",
    url,
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const res = await axios<{ count: number }>(config);
    return res.data.count;
  } catch (error: any) {
    console.log("getUnreadNotificationCount error", error?.response?.data || error?.message);
    throw error;
  }
};
