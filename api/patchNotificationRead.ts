import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export const patchNotificationRead = async (token: string, id: string) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/notifications/${id}/read`;

  const config: AxiosRequestConfig = {
    method: "PATCH",
    url,
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const res = await axios(config);
    return res.data;
  } catch (error: any) {
    console.log("patchNotificationRead error", error?.response?.data || error?.message);
    throw error;
  }
};

export const patchAllNotificationsRead = async (token: string) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/notifications/read-all`;

  const config: AxiosRequestConfig = {
    method: "PATCH",
    url,
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const res = await axios(config);
    return res.data;
  } catch (error: any) {
    console.log("patchAllNotificationsRead error", error?.response?.data || error?.message);
    throw error;
  }
};
