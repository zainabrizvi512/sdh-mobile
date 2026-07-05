import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export const postDataSecurityRestoreTest = async (
  token: string,
  snapshotId: string,
  notes?: string,
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/recovery/restore-test`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: { snapshotId, notes },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.log("postDataSecurityRestoreTest error", error?.response?.data || error?.message);
    throw error;
  }
};
