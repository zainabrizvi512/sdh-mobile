import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type DisasterFrameworkTask = {
  id: string;
  title: string;
  priority?: "CRITICAL" | "HIGH" | "NORMAL" | string;
  assignee?: string;
  status?: string;
  [key: string]: any;
};

export const getDisasterFrameworkTasks = async (token: string, status: string = "ASSIGNED") => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${envConfig.EXPO_PUBLIC_BASE_URL}/disaster-framework/tasks?status=${encodeURIComponent(status)}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios<DisasterFrameworkTask[]>(config);
    return response.data;
  } catch (error: any) {
    console.log("getDisasterFrameworkTasks error", error?.response?.data || error?.message);
    throw error;
  }
};
