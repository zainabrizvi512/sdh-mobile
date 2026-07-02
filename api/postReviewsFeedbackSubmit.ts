import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostReviewsFeedbackSubmitPayload = {
  rating?: number;
  comment?: string;
  isAnonymous?: boolean;
};

export const postReviewsFeedbackSubmit = async (token: string, payload: PostReviewsFeedbackSubmitPayload) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/reviews-feedback/submit`,
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
    console.log("postReviewsFeedbackSubmit error", error?.response?.data || error?.message);
    throw error;
  }
};
