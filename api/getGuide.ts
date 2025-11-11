import { envConfig } from "@/config/envConfig";
import axios from "axios";
import { SafetyGuide } from "./getSafetyGuides";

const API = axios.create({
    baseURL: envConfig.EXPO_PUBLIC_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
});

export async function getGuide(id: string) {
    const res = await API.get<SafetyGuide>(`/safety/guides/${id}`);
    return res.data;
}