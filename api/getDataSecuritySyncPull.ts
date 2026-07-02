import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type SyncDelta = {
  id: string;
  entityType: string;
  entityId?: string | null;
  payload: Record<string, unknown>;
  version: number;
  status: string;
  createdAt: string;
};

export const getDataSecuritySyncPull = async (token: string, since?: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/sync/pull`,
    headers: { Authorization: `Bearer ${token}` },
    params: since ? { since } : undefined,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<{ deltas: SyncDelta[]; pulledAt: string }>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDataSecuritySyncPull error", error?.response?.data || error?.message);
    throw error;
  }
};
