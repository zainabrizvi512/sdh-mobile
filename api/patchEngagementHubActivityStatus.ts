import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export const patchEngagementHubActivityStatus = async (token: string, activityId: string, status: string) => {
  const config: AxiosRequestConfig = {
    method: "PATCH",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/engagement-hub/activities/${activityId}/status`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: { status },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.log("patchEngagementHubActivityStatus error", error?.response?.data || error?.message);
    throw error;
  }
};
