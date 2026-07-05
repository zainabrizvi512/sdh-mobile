import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export const postDataSecurityRestoreSnapshot = async (token: string, snapshotId: string) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/recovery/restore`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: { snapshotId },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.log("postDataSecurityRestoreSnapshot error", error?.response?.data || error?.message);
    throw error;
  }
};
