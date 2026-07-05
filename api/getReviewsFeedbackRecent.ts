import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type FeedbackReview = {
  id: string;
  rating?: number | null;
  comment?: string | null;
  isAnonymous: boolean;
  status: string;
  submitterLabel: string;
  createdAt: string;
};

export const getReviewsFeedbackRecent = async (token: string, limit = 10) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/reviews-feedback/recent`,
    headers: { Authorization: `Bearer ${token}` },
    params: { limit },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<{ reviews: FeedbackReview[] }>(config);
    return response.data;
  } catch (error: any) {
    console.log("getReviewsFeedbackRecent error", error?.response?.data || error?.message);
    throw error;
  }
};
