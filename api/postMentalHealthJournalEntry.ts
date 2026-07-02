import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostMentalHealthJournalEntryPayload = {
  prompt?: string;
  content: string;
};

export const postMentalHealthJournalEntry = async (
  token: string,
  payload: PostMentalHealthJournalEntryPayload,
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/mental-health/self-help/journal-entries`,
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
    console.log("postMentalHealthJournalEntry error", error?.response?.data || error?.message);
    throw error;
  }
};
