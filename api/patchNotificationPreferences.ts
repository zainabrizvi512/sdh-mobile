import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";
import { NotificationPreferences } from "./getNotificationPreferences";

export type UpdateNotificationPreferencesDto = Partial<
  Pick<NotificationPreferences, "emergencyAlerts" | "news" | "chatMessages" | "donationUpdates">
>;

export const patchNotificationPreferences = async (
  token: string,
  dto: UpdateNotificationPreferencesDto
) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/notifications/preferences`;

  const config: AxiosRequestConfig = {
    method: "PATCH",
    url,
    data: dto,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios<NotificationPreferences>(config);
    return res.data;
  } catch (error: any) {
    console.log("patchNotificationPreferences error", error?.response?.data || error?.message);
    throw error;
  }
};
