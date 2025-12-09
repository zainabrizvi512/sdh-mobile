import { getLoggedInUser } from "@/api/getLoggedInUser";
import { patchUpdateLocation } from "@/api/patchUpdateLocation"; // 👈 NEW
import ScreenWrapper from "@/components/screenWrapper";
import type { RootStackParamList } from "@/navigation/rootStack/types";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { styles } from "./styles";
import { T_CHOOSELOCATION } from "./types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ChooseLocation: React.FC<T_CHOOSELOCATION> = ({ navigation, route }) => {
    const navigationObj = useNavigation<Nav>();
    const { getCredentials } = useAuth0();
    const mapRef = useRef<MapView | null>(null);

    const [region, setRegion] = useState<Region>({
        latitude: 24.8621,
        longitude: 67.0011,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loadingGPS, setLoadingGPS] = useState(false);

    const handleMapPress = (e: MapPressEvent) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setMarker({ latitude, longitude });
    };

    const useCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            // Islamabad fallback if denied
            setRegion({
                latitude: 33.6844,
                longitude: 73.0479,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
            return;
        }

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const nextRegion: Region = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        setRegion(nextRegion);
    };

    useEffect(() => {
        useCurrentLocation();
    }, []);

    const getCityFromCoords = async (lat: number, lon: number) => {
        try {
            const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
            // Prefer city, fall back to region/subregion
            const best =
                places?.[0]?.city ||
                places?.[0]?.district ||
                places?.[0]?.subregion ||
                places?.[0]?.region;
            return best || undefined;
        } catch {
            return undefined;
        }
    };

    const onDone = async () => {
        try {
            setLoadingGPS(true);

            // 1) Pick the final coordinate (marker > region)
            const lat = marker?.latitude ?? region.latitude;
            const lon = marker?.longitude ?? region.longitude;

            // 2) Optional: derive city
            const city = await getCityFromCoords(lat, lon);

            // 3) Auth + call PATCH /users/me/location
            const { accessToken } = await getCredentials();
            await patchUpdateLocation(accessToken!, { latitude: lat, longitude: lon, city });
            // 4) Fetch profile to decide where to go (your original logic)
            const user = await getLoggedInUser(accessToken!);
            if (user && (!user.name || !user.gender)) {
                navigation.navigate("SetProfile", {});
            } else {
                navigationObj.reset({
                    index: 0,
                    routes: [
                        {
                            name: "DashboardStack",
                            params: { screen: "Dashboard" },
                        },
                    ],
                });
            }
        } catch (err: any) {
            Alert.alert(
                "Location Update Failed",
                err?.response?.data?.message || err?.message || "Please try again."
            );
        } finally {
            setLoadingGPS(false);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* Title */}
                <Text style={styles.title}>Choose your{"\n"}Location</Text>
                <Text style={styles.subtitle}>
                    Let’s find your unforgettable event.{'\n'}
                    Choose location below to get started.
                </Text>

                {/* Current Location label */}
                <Text style={styles.sectionLabel}>Current Location</Text>

                {/* Map preview */}
                <View style={styles.mapCard}>
                    <MapView
                        ref={mapRef}
                        style={StyleSheet.absoluteFill}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={region}
                        onRegionChangeComplete={setRegion}
                        onPress={handleMapPress}
                        showsUserLocation
                        followsUserLocation
                        showsMyLocationButton
                        zoomEnabled
                        zoomControlEnabled
                    >
                        {/* Show a marker at either user-picked point or the current region center */}
                        <Marker
                            coordinate={{
                                latitude: marker?.latitude ?? region.latitude,
                                longitude: marker?.longitude ?? region.longitude,
                            }}
                        />
                    </MapView>
                </View>

                {/* Done -> Patch /users/me/location */}
                <Pressable
                    onPress={onDone}
                    disabled={loadingGPS}
                    style={({ pressed }) => [
                        styles.primaryBtn,
                        pressed && { opacity: 0.96, transform: [{ scale: 0.99 }] },
                    ]}
                    accessibilityRole="button"
                >
                    <Text style={styles.primaryText}>{loadingGPS ? "Saving..." : "Done"}</Text>
                </Pressable>
            </View>
        </ScreenWrapper>
    );
};

export default ChooseLocation;
