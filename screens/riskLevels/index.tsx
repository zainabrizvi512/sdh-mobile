import ScreenWrapper from "@/components/screenWrapper";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { LEVEL_COLORS, styles } from "./styles";
import { T_RISKLEVELS } from "./types";

export type RiskLevel = {
    level: 1 | 2 | 3 | 4 | 5;
    tag: "Low" | "Guarded" | "Elevated" | "High" | "Severe";
    color: string;
    desc: string;
};

const RiskLevels: React.FC<T_RISKLEVELS> = ({ navigation, route }) => {
    const DATA: RiskLevel[] = useMemo(
        () => [
            {
                level: 1,
                tag: "Low",
                color: LEVEL_COLORS[1],
                desc:
                    "Routine conditions. Stay informed; keep your basic emergency kit ready.",
            },
            {
                level: 2,
                tag: "Guarded",
                color: LEVEL_COLORS[2],
                desc:
                    "Minor risk indicators. Review contact list and safe meeting points.",
            },
            {
                level: 3,
                tag: "Elevated",
                color: LEVEL_COLORS[3],
                desc:
                    "Noticeable threat. Avoid low-lying/unsafe areas; prepare go-bag & fuel.",
            },
            {
                level: 4,
                tag: "High",
                color: LEVEL_COLORS[4],
                desc:
                    "Active risk. Follow local advisories, limit travel, charge devices.",
            },
            {
                level: 5,
                tag: "Severe",
                color: LEVEL_COLORS[5],
                desc:
                    "Extreme danger. Evacuate or shelter-in-place as instructed by NDMA/Rescue.",
            },
        ],
        []
    );

    const renderItem = ({ item }: { item: RiskLevel }) => {
        const darkText = item.level <= 2; // better contrast on light colors
        return (
            <View
                accessibilityRole="summary"
                accessibilityLabel={`Level ${item.level} ${item.tag}`}
                style={[styles.card]}
            >
                <View style={[styles.badge, { backgroundColor: item.color }]}>
                    <Ionicons
                        name="shield-checkmark"
                        size={18}
                        color={darkText ? "#0b0f14" : "#ffffff"}
                        style={{ marginRight: 6 }}
                    />
                    <Text
                        style={[
                            styles.badgeText,
                            { color: darkText ? "#0b0f14" : "#ffffff" },
                        ]}
                    >
                        Level {item.level} — {item.tag}
                    </Text>
                </View>

                <Text style={styles.title}>Severity: <Text style={styles.titleEm}>{item.tag}</Text></Text>
                <Text style={styles.desc}>{item.desc}</Text>
            </View>
        );
    };

    const onBack = () => navigation?.goBack?.();

    return (
        <ScreenWrapper>

            <View style={styles.headerWrap}>
                <TouchableOpacity
                    onPress={onBack}
                    hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                >
                    <Ionicons name="chevron-back" size={24} color="#101828" />
                </TouchableOpacity>
                <Ionicons name="warning" size={18} color="#fff" />
                <Text style={styles.headerText}>Risk / Security Levels (1–5)</Text>
            </View>

            <FlatList
                data={DATA}
                keyExtractor={(it) => String(it.level)}
                renderItem={renderItem}
                contentContainerStyle={styles.listPad}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
        </ScreenWrapper>
    );
};

export default RiskLevels;
