import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type UpdateProfileDto = {
  name?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dob?: string;      // "YYYY-MM-DD"
  picture?: string;  // URL string expected by backend
};

export const updateProfile = async (token: string, dto: UpdateProfileDto) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/users/profile`;
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
    url,
    data: dto,
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log("updateProfile error", error?.response?.data || error?.message);
    throw error;
  }
};