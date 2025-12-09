// src/api/patchUpdateLocation.ts
import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type UpdateLocationDto = {
  latitude: number;
  longitude: number;
  city?: string;
};

export const patchUpdateLocation = async (token: string, dto: UpdateLocationDto) => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/users/me/location`;

  const config: AxiosRequestConfig = {
    method: "PATCH",
    url,
    data: dto,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios(config);
    return res.data; // updated user from backend
  } catch (error: any) {
    console.log("patchUpdateLocation error", error?.response?.data || error?.message);
    throw error;
  }
};
