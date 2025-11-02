import { Ionicons } from "@expo/vector-icons";
import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { ChooseLocationBottomSheetProps, PopularPlace } from "./types";

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!;

type AutoItem = {
    place_id: string;
    main_text: string;
    secondary_text?: string;
};

const ChooseLocationBottomSheet = forwardRef<BottomSheetModal, ChooseLocationBottomSheetProps>(
    ({ snapPoints, onClose, items = [], loading, city, onSelectPlace, anchorLat, anchorLng }, ref) => {
        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={1}
                    disappearsOnIndex={0}
                    pressBehavior="collapse"
                />
            ),
            []
        );

        // ---------- SEARCH ----------
        const [query, setQuery] = useState("");
        const [searching, setSearching] = useState(false);
        const [results, setResults] = useState<AutoItem[]>([]);
        const debTimer = useRef<any>(null);

        const onChangeQuery = (text: string) => {
            setQuery(text);
            if (debTimer.current) clearTimeout(debTimer.current);
            debTimer.current = setTimeout(() => doAutocomplete(text), 350);
        };

        const doAutocomplete = async (text: string) => {
            if (!text?.trim()) {
                setResults([]);
                setSearching(false);
                return;
            }
            setSearching(true);
            try {
                const locBias =
                    anchorLat && anchorLng ? `&location=${anchorLat},${anchorLng}&radius=25000` : "";
                const url =
                    `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
                    `?input=${encodeURIComponent(text)}${locBias}` +
                    `&types=establishment|geocode&key=${GOOGLE_KEY}`;
                const r = await fetch(url);
                const j = await r.json();
                const parsed: AutoItem[] = (j?.predictions || []).map((p: any) => ({
                    place_id: p.place_id,
                    main_text: p.structured_formatting?.main_text ?? p.description,
                    secondary_text: p.structured_formatting?.secondary_text,
                }));
                setResults(parsed);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        };

        const fetchDetailsAndSelect = async (item: AutoItem) => {
            try {
                const url =
                    `https://maps.googleapis.com/maps/api/place/details/json` +
                    `?place_id=${item.place_id}&fields=geometry,name,formatted_address&key=${GOOGLE_KEY}`;
                const r = await fetch(url);
                const j = await r.json();
                const g = j?.result?.geometry?.location;
                if (!g) return;
                onSelectPlace?.({
                    id: item.place_id,
                    title: j?.result?.name || item.main_text,
                    subtitle: j?.result?.formatted_address || item.secondary_text,
                    lat: g.lat,
                    lng: g.lng,
                    distanceKm: 0, // (optional) you may recompute against current center
                });
            } catch { }
        };

        // ---------- LIST RENDER ----------
        const renderPopular = ({ item }: { item: PopularPlace }) => (
            <TouchableOpacity style={styles.listItem} activeOpacity={0.8} onPress={() => onSelectPlace?.(item)}>
                <View style={styles.locationInfo}>
                    <Ionicons name="location-sharp" size={18} color="#2FBF71" style={{ marginRight: 8 }} />
                    <View>
                        <Text style={styles.locationTitle}>{item.title}</Text>
                        {item.subtitle ? <Text style={styles.locationSubtitle}>{item.subtitle}</Text> : null}
                    </View>
                </View>
                <Text style={styles.distance}>{item.distanceKm.toFixed(2)} KM</Text>
            </TouchableOpacity>
        );

        const renderSearch = ({ item }: { item: AutoItem }) => (
            <TouchableOpacity style={styles.listItem} activeOpacity={0.8} onPress={() => fetchDetailsAndSelect(item)}>
                <View style={styles.locationInfo}>
                    <Ionicons name="search-outline" size={18} color="#2FBF71" style={{ marginRight: 8 }} />
                    <View>
                        <Text style={styles.locationTitle}>{item.main_text}</Text>
                        {item.secondary_text ? <Text style={styles.locationSubtitle}>{item.secondary_text}</Text> : null}
                    </View>
                </View>
            </TouchableOpacity>
        );

        const showSearchList = query.trim().length > 0;

        return (
            <BottomSheetModal
                ref={ref}
                index={1}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={false}
                handleIndicatorStyle={{ backgroundColor: "#C7C7C7" }}
                keyboardBehavior="interactive"
                bottomInset={12}   // avoid keyboard overlap
            >
                <BottomSheetView style={styles.contentContainer}>
                    {/* Search bar */}
                    <View style={styles.searchBox}>
                        <Ionicons name="search-outline" size={18} color="#999" />
                        <BottomSheetTextInput
                            value={query}
                            onChangeText={onChangeQuery}
                            placeholder="Search Location"
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                        {query ? (
                            <TouchableOpacity onPress={() => { setQuery(""); setResults([]); }}>
                                <Ionicons name="close" size={18} color="#999" />
                            </TouchableOpacity>
                        ) : (
                            <Ionicons name="swap-vertical" size={18} color="#999" />
                        )}
                    </View>

                    {/* Title */}
                    {!showSearchList && (
                        <Text style={styles.sectionTitle}>
                            {city ? `Popular Location • ${city}` : "Popular Location"}
                        </Text>
                    )}

                    {/* Scrollable list (ALWAYS scrollable) */}
                    {showSearchList ? (
                        searching ? (
                            <View style={{ paddingVertical: 24, alignItems: "center" }}>
                                <ActivityIndicator />
                                <Text style={{ marginTop: 8, color: "#666" }}>Searching…</Text>
                            </View>
                        ) : (
                            <BottomSheetFlatList
                                data={results}
                                keyExtractor={(it: { place_id: any; }) => it.place_id}
                                renderItem={renderSearch}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{ paddingBottom: 16 }}
                                showsVerticalScrollIndicator={false}
                            />
                        )
                    ) : loading ? (
                        <View style={{ paddingVertical: 24, alignItems: "center" }}>
                            <ActivityIndicator />
                            <Text style={{ marginTop: 8, color: "#666" }}>Finding places…</Text>
                        </View>
                    ) : (
                        <BottomSheetFlatList
                            data={items}
                            keyExtractor={(it: { id: any; }) => it.id}
                            renderItem={renderPopular}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ paddingBottom: 16 }}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

export default ChooseLocationBottomSheet;
