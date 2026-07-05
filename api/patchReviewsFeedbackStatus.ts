import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type FeedbackStatus = "PENDING" | "APPROVED" | "FLAGGED" | "ESCALATED";

export const patchReviewsFeedbackStatus = async (
  token: string,
  feedbackId: string,
  status: FeedbackStatus,
  note?: string,
) => {
  const config: AxiosRequestConfig = {
    method: "PATCH",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/reviews-feedback/admin/${feedbackId}/status`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: { status, note },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.log("patchReviewsFeedbackStatus error", error?.response?.data || error?.message);
    throw error;
  }
};
