import { envConfig } from "@/config/envConfig";
import axios from "axios";

const API = axios.create({
    baseURL: envConfig.EXPO_PUBLIC_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
});

export async function getDisasterTypes() {
    const res = await API.get<{ id: string; slug: string; name: string }[]>(
        '/safety/disaster-types',
    );
    return res.data;
}
