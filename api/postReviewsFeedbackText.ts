import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostReviewsFeedbackTextPayload = {
  comment: string;
  isAnonymous?: boolean;
};

export const postReviewsFeedbackText = async (token: string, payload: PostReviewsFeedbackTextPayload) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/reviews-feedback/text`,
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
    console.log("postReviewsFeedbackText error", error?.response?.data || error?.message);
    throw error;
  }
};
