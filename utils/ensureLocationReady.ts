import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";

/** Opens OS settings for location */
async function openLocationSettings() {
    if (Platform.OS === "ios") {
        await Linking.openURL("App-Prefs:Privacy&path=LOCATION"); // best-effort
        await Linking.openSettings();
    } else {
        await Linking.openSettings(); // opens app settings; user can reach Location from there
    }
}

/** Ensure services + permission are OK before using location */
export async function ensureLocationReady(): Promise<{
    ok: boolean;
    status?: Location.PermissionStatus;
}> {
    // 1) Are location services enabled globally (GPS / network)?
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
        Alert.alert(
            "Turn On Location",
            "Location services are disabled. Please enable them to share your live location.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: openLocationSettings },
            ]
        );
        return { ok: false };
    }

    // 2) Foreground permission (request precise if available)
    const { status, canAskAgain, granted } =
        await Location.requestForegroundPermissionsAsync();

    if (!granted) {
        if (canAskAgain) {
            // user just denied; you could show another gentle prompt
        } else {
            Alert.alert(
                "Permission Needed",
                "We need location permission to share your live location. Enable it in Settings.",
                [{ text: "Open Settings", onPress: openLocationSettings }, { text: "Cancel", style: "cancel" }]
            );
        }
        return { ok: false, status };
    }

    // 3) Optional: if iOS offered only approximate accuracy and you want precise, ask upgrade
    // (Expo doesn't have a separate prompt API; if you really need precise on iOS 14+, guide user to Settings)
    console.log("servicesEnabled", servicesEnabled)
    return { ok: true, status };
}