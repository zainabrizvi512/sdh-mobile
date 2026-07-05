import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DataSecurityLastRestoreTestResponse = {
  lastVerifiedRestoreTest: {
    id: string;
    status: string;
    testedAt: string;
    displayLabel: string;
  } | null;
  incidentReplayAvailable?: boolean;
};

export const getDataSecurityLastRestoreTest = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/data-security/recovery/restore-test/latest`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DataSecurityLastRestoreTestResponse>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDataSecurityLastRestoreTest error", error?.response?.data || error?.message);
    throw error;
  }
};
