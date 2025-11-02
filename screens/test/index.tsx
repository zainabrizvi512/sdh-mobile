// Test.tsx
import ScreenWrapper from "@/components/screenWrapper";
import { GREEN } from "@/constants/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { styles } from "./styles";
import { T_TEST } from "./types";

const Test: React.FC<T_TEST> = () => {
    const router = useRouter();
    const mapRef = useRef<MapView | null>(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [region, setRegion] = useState<Region>({
        latitude: 24.8621,
        longitude: 67.0011,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loadingGPS, setLoadingGPS] = useState(false);

    const goBack = () => router.back();

    const openMapPicker = () => {
        // router.push("/(modals)/map-picker");
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
            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

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

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* Back */}
                <Pressable
                    onPress={goBack}
                    hitSlop={12}
                    style={styles.backBtn}
                    accessibilityRole="button"
                >
                    <Ionicons name="chevron-back" size={22} color="#fff" />
                </Pressable>

                {/* Title */}
                <Text style={styles.title}>Choose your{"\n"}Location</Text>
                <Text style={styles.subtitle}>
                    Let’s find your unforgettable event.{'\n'}
                    Choose location below to get started.
                </Text>

                {/* Search */}
                <View style={styles.searchWrap}>
                    <Feather name="search" size={18} color="#b3b3b3" style={styles.searchIcon} />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search Location"
                        placeholderTextColor="#b9b9b9"
                        style={styles.searchInput}
                        returnKeyType="search"
                    />
                </View>

                {/* Set Location on Map (outline) */}
                <Pressable
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
                </Pressable>

                {/* Current Location label */}
                <Text style={styles.sectionLabel}>Current Location</Text>

                {/* Map preview */}
                <View style={styles.mapCard}>
                    {/* <MapView
                        style={styles.map}
                        region={region}
                        onRegionChangeComplete={setRegion}
                        onPress={handleMapPress}
                    >
                        {marker && <Marker coordinate={marker} />}
                    </MapView> */}
                    <MapView
                        ref={mapRef}
                        style={StyleSheet.absoluteFill}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={region}
                        showsUserLocation
                        followsUserLocation
                        showsMyLocationButton
                        zoomEnabled
                        zoomControlEnabled   // shows + / – buttons on Android
                        onRegionChangeComplete={setRegion}
                    >
                        {/* Optional: put a marker where the user is (showsUserLocation already draws a blue dot) */}
                        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                    </MapView>
                </View>

                {/* Use Current Location */}
                <Pressable
                    onPress={useCurrentLocation}
                    disabled={loadingGPS}
                    style={({ pressed }) => [
                        styles.primaryBtn,
                        pressed && { opacity: 0.96, transform: [{ scale: 0.99 }] },
                    ]}
                    accessibilityRole="button"
                >
                    <Text style={styles.primaryText}>
                        {loadingGPS ? "Locating..." : "Use Current Location"}
                    </Text>
                </Pressable>
            </View>
        </ScreenWrapper>
    );
};

export default Test;
