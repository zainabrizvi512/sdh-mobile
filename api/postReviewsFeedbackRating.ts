import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type PostReviewsFeedbackRatingPayload = {
  rating: number;
  isAnonymous?: boolean;
};

export const postReviewsFeedbackRating = async (token: string, payload: PostReviewsFeedbackRatingPayload) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/reviews-feedback/rating`,
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
    console.log("postReviewsFeedbackRating error", error?.response?.data || error?.message);
    throw error;
  }
};
