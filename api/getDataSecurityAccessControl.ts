import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type AccessControlPolicy = {
  role: string;
  description?: string | null;
  permissions: Record<string, boolean>;
};

export const getDataSecurityAccessControl = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/access-control`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<{ policies: AccessControlPolicy[] }>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDataSecurityAccessControl error", error?.response?.data || error?.message);
    throw error;
  }
};
