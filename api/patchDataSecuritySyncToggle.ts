import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export const patchDataSecuritySyncToggle = async (token: string, enabled: boolean) => {
  const config: AxiosRequestConfig = {
    method: "PATCH",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/sync/toggle`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: { enabled },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.log("patchDataSecuritySyncToggle error", error?.response?.data || error?.message);
    throw error;
  }
};
