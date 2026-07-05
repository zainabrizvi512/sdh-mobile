import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export const deleteRegisterPushToken = async (token: string, pushToken: string) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/notifications/token`;

  const config: AxiosRequestConfig = {
    method: "DELETE",
    url,
    data: { token: pushToken },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios(config);
    return res.data;
  } catch (error: any) {
    console.log("deleteRegisterPushToken error", error?.response?.data || error?.message);
    throw error;
  }
};
