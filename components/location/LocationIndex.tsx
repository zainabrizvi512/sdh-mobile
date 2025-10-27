// app/(onboarding)/choose-location.tsx
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import MapView, { MapPressEvent, Marker, Region } from "react-native-maps";
// import * as Location from "expo-location"; // enable when wiring real GPS

const GREEN = "#1f3d18";
const TEXT = "#0f0f0f";
const MUTED = "#6f6f6f";
const BORDER = "#e5e5e5";
const INPUT_BG = "#efefef";

export default function LocationScreen() {
  const router = useRouter();

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

  // Place/move a marker where the user taps
  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  const useCurrentLocation = async () => {
    setLoadingGPS(true);

    // --- Real GPS (uncomment when ready) ---
    /*
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      setRegion(prev => ({ ...prev, latitude, longitude }));
      setMarker({ latitude, longitude });
    } finally {
      setLoadingGPS(false);
    }
    */

    // Simulate a short loading (remove once real GPS is wired)
    setTimeout(() => setLoadingGPS(false), 500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Back */}
        <Pressable onPress={goBack} hitSlop={12} style={styles.backBtn} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color={GREEN} />
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
            onSubmitEditing={() => {
              // TODO: Hook to your geocode/autocomplete
            }}
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
          <Ionicons name="location-outline" size={18} color={GREEN} />
          <Text style={styles.outlineBtnText}>Set Location on Map</Text>
          <View style={{ width: 18 }} />
        </Pressable>

        {/* Current Location label */}
        <Text style={styles.sectionLabel}>Current Location</Text>

        {/* Map preview */}
        <View style={styles.mapCard}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
          >
            {marker && <Marker coordinate={marker} />}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 8 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: TEXT,
    marginTop: 2,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
  },
  searchWrap: {
    position: "relative",
    height: 48,
    borderRadius: 28,
    backgroundColor: INPUT_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    justifyContent: "center",
  },
  searchIcon: { position: "absolute", left: 16, zIndex: 1 },
  searchInput: { paddingLeft: 42, paddingRight: 16, color: TEXT, fontSize: 14 },
  outlineBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  outlineBtnText: { color: GREEN, fontWeight: "700", fontSize: 14 },
  sectionLabel: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 13,
    color: GREEN,
    fontWeight: "800",
  },
  mapCard: {
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#f7f7f7",
  },
  map: { flex: 1 },
  primaryBtn: {
    marginTop: 24,
    height: 52,
    borderRadius: 28,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: Platform.select({ ios: 0.12, android: 0.2 }) as number,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
