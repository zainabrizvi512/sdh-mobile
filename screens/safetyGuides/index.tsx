import { getDisasterTypes } from "@/api/getDisasterTypes";
import { getSafetyGuides, SafetyGuide } from "@/api/getSafetyGuides";
import ScreenWrapper from "@/components/screenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { T_SAFETYGUIDES } from "./types";

const SafetyGuides: React.FC<T_SAFETYGUIDES> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [guides, setGuides] = useState<SafetyGuide[]>([]);
    const [q, setQ] = useState("");
    const [city, setCity] = useState("Islamabad"); // default for your use-case
    const [disaster, setDisaster] = useState<string | undefined>(undefined);
    const [types, setTypes] = useState<{ slug: string; name: string }[]>([]);

    // Hide native header so your inline back bar is visible
    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const filtered = useMemo(() => guides, [guides]);

    const load = async () => {
        try {
            setLoading(true);
            const [t, g] = await Promise.all([
                getDisasterTypes(),
                getSafetyGuides({ city, disaster, q, published: true }),
            ]);
            setTypes(t.map((x) => ({ slug: x.slug, name: x.name })));
            setGuides(g);
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city, disaster, q]);

    return (
        <ScreenWrapper>
            {/* Inline Back Bar (your style, fixed colors) */}
            <View
                style={{
                    backgroundColor: "#FFFFFF",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                }}
            >
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={{ paddingHorizontal: 8, paddingVertical: 6 }}
                    hitSlop={8}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </Pressable>
                <Text style={{ color: "#000", fontSize: 18, fontWeight: "700" }}>Find Guides</Text>
            </View>

            {/* Body */}
            <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
                {/* Filters */}
                <View style={{ padding: 12, gap: 8 }}>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                        <TextInput
                            placeholder="Search title…"
                            placeholderTextColor="#000"
                            value={q}
                            onChangeText={setQ}
                            style={{
                                flex: 1,
                                backgroundColor: "#b1b3b4ff",
                                color: "#000",
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                borderRadius: 10,
                            }}
                        />
                        <TextInput
                            placeholder="City"
                            placeholderTextColor="#000"
                            value={city}
                            onChangeText={setCity}
                            style={{
                                width: 130,
                                backgroundColor: "#b1b3b4ff",
                                color: "#000",
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                borderRadius: 10,
                            }}
                        />
                    </View>

                    {/* Disaster pill filter */}
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        <FilterPill label="All" active={!disaster} onPress={() => setDisaster(undefined)} />
                        {types.map((t) => (
                            <FilterPill
                                key={t.slug}
                                label={t.name}
                                active={disaster === t.slug}
                                onPress={() => setDisaster(t.slug)}
                            />
                        ))}
                    </View>
                </View>

                {/* List */}
                {loading ? (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator color="#1D9BF0" />
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(g) => g.id}
                        contentContainerStyle={{ padding: 12, gap: 10 }}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() =>
                                    navigation.navigate("SafetyGuideDetail", { id: item.id, title: item.title })
                                }
                                style={{
                                    backgroundColor: "#121821",
                                    borderRadius: 14,
                                    padding: 14,
                                    borderWidth: 1,
                                    borderColor: "#1E2A38",
                                }}
                            >
                                <Text style={{ color: "#E6EEF8", fontSize: 16, fontWeight: "700" }}>
                                    {item.title}
                                </Text>
                                <Text style={{ color: "#9FB0C6", marginTop: 4 }}>
                                    {item.disasterType?.name} • {item.regionCity ?? "Region"}{" "}
                                    {item.regionProvince ? `(${item.regionProvince})` : ""}
                                </Text>
                                <Text style={{ color: "#72849A", marginTop: 8, fontSize: 12 }}>
                                    Updated: {new Date(item.updatedAt).toLocaleDateString()}
                                </Text>
                            </Pressable>
                        )}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

function FilterPill({
    label,
    active,
    onPress,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: active ? "#1D9BF0" : "#141A22",
                borderWidth: 1,
                borderColor: active ? "#1D9BF0" : "#223042",
            }}
        >
            <Text style={{ color: active ? "#fff" : "#B9C7D8", fontWeight: "600" }}>{label}</Text>
        </Pressable>
    );
}

export default SafetyGuides;
