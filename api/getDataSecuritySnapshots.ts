import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type BackupSnapshot = {
  id: string;
  snapshotType: string;
  storageLocation?: string | null;
  checksum?: string | null;
  sizeBytes?: number | null;
  createdAt: string;
};

export const getDataSecuritySnapshots = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/recovery/snapshots`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<{ snapshots: BackupSnapshot[] }>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDataSecuritySnapshots error", error?.response?.data || error?.message);
    throw error;
  }
};
