import ScreenWrapper from "@/components/screenWrapper";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { styles } from "./styles";
import { T_CHOOSELOCATION } from "./types";

const ChooseLocation: React.FC<T_CHOOSELOCATION> = ({ navigation, route }) => {
    const mapRef = useRef<MapView | null>(null);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState<Region>({
        latitude: 24.8621,
        longitude: 67.0011,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loadingGPS, setLoadingGPS] = useState(false);

    const openMapPicker = () => {
        navigation.navigate("MapLocation", {});
    };

    const handleMapPress = (e: MapPressEvent) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setMarker({ latitude, longitude });
    };

    const useCurrentLocation = async () => {
        (async () => {
            // Ask for foreground location permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                // fall back to a default region if denied
                setRegion({
                    latitude: 33.6844,      // Islamabad fallback
                    longitude: 73.0479,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
                setLoading(false);
                return;
            }

            // Get current location
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const nextRegion: Region = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setRegion(nextRegion);
            setLoading(false);
        })();
    };

    useEffect(() => {
        useCurrentLocation()
    }, [])

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* Title */}
                <Text style={styles.title}>Choose your{"\n"}Location</Text>
                <Text style={styles.subtitle}>
                    Let’s find your unforgettable event.{'\n'}
                    Choose location below to get started.
                </Text>

                {/* Set Location on Map (outline) */}
                {/* <Pressable
                    onPress={openMapPicker}
                    style={({ pressed }) => [
                        styles.outlineBtn,
                        pressed && { opacity: 0.9, transform: [{ scale: 0.995 }] },
                    ]}
                    accessibilityRole="button"
                >
                    <View style={styles.outlineInner}>
                        <Ionicons name="location-outline" size={18} color={GREEN} style={{ marginRight: 8 }} />
                        <Text style={styles.outlineBtnText}>Set Location on Map</Text>
                    </View>
                </Pressable> */}

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
                        zoomControlEnabled   // shows + / – buttons on Android
                    >
                        {/* Optional: put a marker where the user is (showsUserLocation already draws a blue dot) */}
                        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                    </MapView>
                </View>

                {/* Use Current Location */}
                <Pressable
                    onPress={() => { }}
                    disabled={loadingGPS}
                    style={({ pressed }) => [
                        styles.primaryBtn,
                        pressed && { opacity: 0.96, transform: [{ scale: 0.99 }] },
                    ]}
                    accessibilityRole="button"
                >
                    <Text style={styles.primaryText}>
                        {loadingGPS ? "Locating..." : "Done"}
                    </Text>
                </Pressable>
            </View>
        </ScreenWrapper>
    );
};

export default ChooseLocation;