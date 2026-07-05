import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type MentalHealthSession = {
  id: string;
  status: string;
  notes?: string | null;
  professional: {
    id: string;
    name: string;
    specialty: string;
    sessionType: string;
  };
  createdAt: string;
};

export const getMentalHealthMySessions = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/mental-health/sessions/my`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<{ sessions: MentalHealthSession[] }>(config);
    return response.data;
  } catch (error: any) {
    console.log("getMentalHealthMySessions error", error?.response?.data || error?.message);
    throw error;
  }
};
