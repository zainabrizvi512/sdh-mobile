import { FAV_KEY } from "@/screens/emergencyContactsListing";
import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "sdh.accessToken";
const REFRESH_KEY = "sdh.refreshToken";
const EXP_KEY = "sdh.accessTokenExp"; // epoch seconds (optional but useful)

export async function saveTokens(params: {
    accessToken: string;
    refreshToken?: string | null;
    accessTokenExpiresAt?: number; // epoch seconds
}) {
    await SecureStore.setItemAsync(ACCESS_KEY, params.accessToken);
    if (params.refreshToken) {
        await SecureStore.setItemAsync(REFRESH_KEY, params.refreshToken);
    }
    if (params.accessTokenExpiresAt) {
        await SecureStore.setItemAsync(EXP_KEY, String(params.accessTokenExpiresAt));
    }
}

export async function getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function getAccessTokenExp(): Promise<number | null> {
    const v = await SecureStore.getItemAsync(EXP_KEY);
    return v ? Number(v) : null;
}

export async function clearTokens() {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    await SecureStore.deleteItemAsync(EXP_KEY);
    await SecureStore.deleteItemAsync(FAV_KEY);
}
