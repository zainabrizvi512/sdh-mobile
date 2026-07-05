import { postRegisterPushToken } from "@/api/postRegisterPushToken";
import Constants from "expo-constants";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAuth0 } from "react-native-auth0";

// expo-device / expo-notifications are native modules. If the running app binary
// hasn't been rebuilt since they were added (e.g. still on an older dev-client / Expo Go
// install), even `require`-ing them throws "Cannot find native module". Loading them lazily
// inside a try/catch means that failure degrades to "push notifications are unavailable"
// instead of crashing the whole app on import.
let Device: typeof import("expo-device") | null = null;
let Notifications: typeof import("expo-notifications") | null = null;
let nativeModulesAvailable = false;

try {
    Device = require("expo-device");
    Notifications = require("expo-notifications");

    Notifications!.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    nativeModulesAvailable = true;
} catch (e) {
    console.log(
        "Push notifications unavailable: expo-device/expo-notifications native modules aren't built into this app binary yet. Rebuild the native app (npx expo run:ios / run:android, or a new dev-client/EAS build) to enable them."
    );
}

export async function getExpoPushTokenSilently(): Promise<string | null> {
    if (!nativeModulesAvailable || !Device || !Notifications) return null;

    if (!Device.isDevice) {
        console.log("Push notifications require a physical device — skipping registration.");
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        console.log("Push notification permission not granted.");
        return null;
    }

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#0f4c3a",
        });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
        console.log(
            "No EAS projectId configured (app.json extra.eas.projectId) — cannot request an Expo push token yet."
        );
        return null;
    }

    try {
        const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
        return data;
    } catch (e) {
        console.log("getExpoPushTokenAsync error", e);
        return null;
    }
}

/** Requests permission, fetches an Expo push token, and registers it with the backend for the current user. Safe to call repeatedly, and a no-op if the native modules aren't built into this app binary yet. */
export function usePushNotifications() {
    const { getCredentials } = useAuth0();

    useEffect(() => {
        if (!nativeModulesAvailable) return;
        let mounted = true;

        (async () => {
            const expoPushToken = await getExpoPushTokenSilently();
            if (!expoPushToken || !mounted) return;

            try {
                const { accessToken } = await getCredentials();
                if (!accessToken) return;
                await postRegisterPushToken(accessToken, {
                    token: expoPushToken,
                    platform: Platform.OS === "ios" ? "ios" : "android",
                });
            } catch (e) {
                console.log("Failed to register push token", e);
            }
        })();

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
