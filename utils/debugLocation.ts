import * as Location from "expo-location";
import { Alert } from "react-native";

export async function debugLocation() {
    const services = await Location.hasServicesEnabledAsync();
    const perm = await Location.requestForegroundPermissionsAsync();
    const providers = await Location.getProviderStatusAsync().catch(() => null);
    console.log("Debugging Location", services, perm, providers)
    try {
        const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 1000,
        });
        console.log("OK", JSON.stringify({ services, perm, providers, pos }, null, 2));
    } catch (e: any) {
        Alert.alert("FAIL", JSON.stringify({ services, perm, providers, err: String(e) }, null, 2));
    }
}
