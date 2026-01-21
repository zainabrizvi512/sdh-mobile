import axios, { AxiosRequestConfig } from "axios";
import { envConfig } from "../config/envConfig";

export interface IUser {
    city: any
    connectionType: string
    createdAt: string
    email: string
    gender: string
    id: string
    latitude: any
    location: ILocation
    longitude: any
    name: string
    phone: string
    picture: string
    sub: string
    updatedAt: string
    username: string
    ngo: { name: string, id: string }
}

export interface ILocation {
  x: number
  y: number
}

export const getLoggedInUser = async (token: string) => {
    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/users/me`;
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        maxBodyLength: Infinity,
        method: "GET",
        url,
    };

    try {
        const response = await axios<IUser>(config);
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log("error", error);
        throw error;
    }
};
