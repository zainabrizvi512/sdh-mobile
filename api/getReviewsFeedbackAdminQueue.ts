import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";
import { FeedbackReview } from "./getReviewsFeedbackRecent";

export type ReviewsFeedbackAdminQueueResponse = {
  pipeline: string[];
  summary: {
    pendingCount: number;
    flaggedCount: number;
    newEntriesLabel: string;
    flaggedLabel: string;
  };
  queue: FeedbackReview[];
};

export const getReviewsFeedbackAdminQueue = async (token: string, status?: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/reviews-feedback/admin/queue`,
    headers: { Authorization: `Bearer ${token}` },
    params: status ? { status } : undefined,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<ReviewsFeedbackAdminQueueResponse>(config);
    return response.data;
  } catch (error: any) {
    console.log("getReviewsFeedbackAdminQueue error", error?.response?.data || error?.message);
    throw error;
  }
};
