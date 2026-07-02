import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type MentalHealthProfessional = {
  id: string;
  name: string;
  specialty: string;
  sessionType: string;
  availabilityLabel: string;
  availabilityDisplay: string;
};

export const getMentalHealthProfessionals = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/mental-health/professionals`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<{ professionals: MentalHealthProfessional[] }>(config);
    return response.data;
  } catch (error: any) {
    console.log("getMentalHealthProfessionals error", error?.response?.data || error?.message);
    throw error;
  }
};
