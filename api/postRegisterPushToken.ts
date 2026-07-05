import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type RegisterPushTokenDto = {
  token: string;
  platform: "ios" | "android";
};

export const postRegisterPushToken = async (token: string, dto: RegisterPushTokenDto) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/notifications/token`;

  const config: AxiosRequestConfig = {
    method: "POST",
    url,
    data: dto,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios(config);
    return res.data;
  } catch (error: any) {
    console.log("postRegisterPushToken error", error?.response?.data || error?.message);
    throw error;
  }
};
