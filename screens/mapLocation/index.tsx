import { ArrowBackIcon } from "@/assets/images/svg";
import ChooseLocationBottomSheet from "@/components/chooseLocationBottomSheet";
import { PopularPlace } from "@/components/chooseLocationBottomSheet/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { styles } from "./styles";
import { T_MAPLOCATION } from "./types";
// (Optional but recommended)
// import { useSafeAreaInsets } from "react-native-safe-area-context";

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!;

const MapLocation: React.FC<T_MAPLOCATION> = ({ navigation }) => {
    const mapRef = useRef<MapView | null>(null);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState<Region | null>(null);

    const [city, setCity] = useState<string>("");
    const [places, setPlaces] = useState<PopularPlace[]>([]);
    const [placesLoading, setPlacesLoading] = useState(false);

    const chooseLocationBottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["15%", "45%", "85%"], []);

    const [selectedPlace, setSelectedPlace] = useState<PopularPlace | null>(null);

    // const insets = useSafeAreaInsets();

    const handleSelectPlace = (place: PopularPlace) => {
        setSelectedPlace(place);
        chooseLocationBottomSheetRef.current?.close();
        const next: Region = {
            latitude: place.lat,
            longitude: place.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        setRegion(next);
        mapRef.current?.animateToRegion(next, 800);
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setRegion({
                    latitude: 33.6844,
                    longitude: 73.0479,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
                setLoading(false);
                chooseLocationBottomSheetRef.current?.present();
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
            setLoading(false);
            chooseLocationBottomSheetRef.current?.present();

            fetchCityAndPlaces(nextRegion.latitude, nextRegion.longitude).catch(() => { });
        })();
    }, []);

    useEffect(() => {
        if (!region) return;
        const t = setTimeout(() => {
            fetchCityAndPlaces(region.latitude, region.longitude).catch(() => { });
        }, 400);
        return () => clearTimeout(t);
    }, [region?.latitude, region?.longitude]);

    const centerOnUser = async () => {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const next = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        setRegion(next);
        mapRef.current?.animateToRegion(next, 600);
    };

    const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (v: number) => (v * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const fetchCityAndPlaces = async (lat: number, lng: number) => {
        setPlacesLoading(true);
        try {
            const [addr] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            const cityName = addr?.city || addr?.subregion || addr?.region || addr?.district || "";
            setCity(cityName);
        } catch {
            setCity("");
        }

        const base = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
        const types = ["tourist_attraction", "park", "museum", "shopping_mall", "restaurant", "cafe"];
        const urls = types.map(
            (t) => `${base}?location=${lat},${lng}&rankby=distance&type=${t}&key=${GOOGLE_KEY}`
        );

        try {
            const pages = await Promise.all(urls.map((u) => fetch(u).then((r) => r.json())));
            const merged = new Map<string, PopularPlace>();
            pages.forEach((res) => {
                (res?.results || []).forEach((p: any) => {
                    const id = p.place_id as string;
                    if (!merged.has(id)) {
                        const plat = p.geometry?.location?.lat;
                        const plng = p.geometry?.location?.lng;
                        const d = haversineKm(lat, lng, plat, plng);
                        merged.set(id, {
                            id,
                            title: p.name,
                            subtitle: p.vicinity || p.formatted_address || "",
                            distanceKm: d,
                            lat: plat,
                            lng: plng,
                        });
                    }
                });
            });
            const sorted = Array.from(merged.values()).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 20);
            setPlaces(sorted);
        } catch (e) {
            console.warn("Places fetch error", e);
            setPlaces([]);
        } finally {
            setPlacesLoading(false);
        }
    };

    return (
        <>
            {loading || !region ? (
                <View style={styles.loader}>
                    <ActivityIndicator />
                    <Text style={{ marginTop: 8 }}>Getting your location…</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={StyleSheet.absoluteFill}
                        initialRegion={region}
                        showsUserLocation
                        followsUserLocation
                        // Android only; we add our own FAB below for both platforms
                        showsMyLocationButton={Platform.OS === "android"}
                        zoomEnabled
                        zoomControlEnabled={Platform.OS === "android"}
                        onRegionChangeComplete={setRegion}
                    >
                        {region && !selectedPlace && (
                            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                        )}
                        {selectedPlace && (
                            <Marker
                                coordinate={{ latitude: selectedPlace.lat, longitude: selectedPlace.lng }}
                                title={selectedPlace.title}
                                description={selectedPlace.subtitle}
                                pinColor="#2FBF71"
                            />
                        )}
                    </MapView>

                    {/* HEADER OVERLAY */}
                    <View
                        pointerEvents="box-none"
                        style={[
                            styles.headerOverlay,
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack?.()}
                            activeOpacity={0.7}
                            style={styles.backBtn}
                        >
                            <ArrowBackIcon />
                        </TouchableOpacity>

                        <Text numberOfLines={1} style={styles.headerTitle}>
                            Choose Location
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={centerOnUser}
                        style={styles.fab}
                    >
                        <Text style={styles.fabText}>Done</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ChooseLocationBottomSheet
                ref={chooseLocationBottomSheetRef}
                onClose={() => chooseLocationBottomSheetRef.current?.close()}
                snapPoints={snapPoints}
                items={places}
                loading={placesLoading}
                city={city}
                onSelectPlace={handleSelectPlace}
                anchorLat={region?.latitude}
                anchorLng={region?.longitude}
            />
        </>
    );
};

export default MapLocation;
