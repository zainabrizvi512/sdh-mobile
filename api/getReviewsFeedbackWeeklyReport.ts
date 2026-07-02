import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type ReviewsFeedbackWeeklyReportResponse = {
  csatScore: number;
  sentimentSummary: string;
  pendingCount: number;
  flaggedCount: number;
  totalSubmissions: number;
  reportReady: boolean;
  displayLabel: string;
};

export const getReviewsFeedbackWeeklyReport = async (token: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/reviews-feedback/admin/report/weekly`,
    headers: { Authorization: `Bearer ${token}` },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<ReviewsFeedbackWeeklyReportResponse>(config);
    return response.data;
  } catch (error: any) {
    console.log("getReviewsFeedbackWeeklyReport error", error?.response?.data || error?.message);
    throw error;
  }
};
