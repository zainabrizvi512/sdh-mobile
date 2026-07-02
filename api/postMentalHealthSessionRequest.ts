import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostMentalHealthSessionRequestPayload = {
  professionalId: string;
  notes?: string;
};

export const postMentalHealthSessionRequest = async (
  token: string,
  payload: PostMentalHealthSessionRequestPayload,
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/mental-health/sessions/request`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: payload,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.log("postMentalHealthSessionRequest error", error?.response?.data || error?.message);
    throw error;
  }
};
