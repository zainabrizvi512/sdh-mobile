// components/BottomNav.tsx
import { GREEN } from "@/constants/theme";
import { DashboardStackParamList } from "@/navigation/dashboardStack/types"; // adjust path
import { RootStackParamList } from "@/navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { memo, useMemo } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Item = {
    key: string;
    label: string;
    icon: string;
    iconOutline?: string;
    target: keyof DashboardStackParamList;
};

const TABS: Item[] = [
    { key: "home", label: "Home", icon: "home", iconOutline: "home-outline", target: "Dashboard" },
    { key: "groups", label: "Groups", icon: "people", iconOutline: "people-outline", target: "GroupListing" },
    // If you don’t have Notifications yet, point it to EmergencyContactsListing or create a Notifications screen.
    // { key: "notifications", label: "Notifications", icon: "notifications", iconOutline: "notifications-outline", target: "EmergencyContactsListing" },
];

const barHeight = 62; // visual height excluding safe area

const BottomNav = memo(() => {
    const insets = useSafeAreaInsets();
    const padBottom = Math.max(insets.bottom, 8);
    const items = useMemo(() => TABS, []);

    const rootNav = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute();
    const current = route.name as keyof DashboardStackParamList | string;

    const onPressTab = (target: keyof DashboardStackParamList, active: boolean) => {
        if (active) return;
        // Navigate to a nested screen inside DashboardStack
        rootNav.navigate("DashboardStack", { screen: target } as never);
    };
    return (
        <View
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                // shadow
                ...Platform.select({
                    ios: { shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: -2 } },
                    android: { elevation: 8 },
                }),
            }}
            pointerEvents="box-none"
        >
            <View
                style={{
                    width: "100%",
                    backgroundColor: GREEN,
                    borderTopLeftRadius: 22,
                    borderTopRightRadius: 22,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingTop: 12,
                    paddingBottom: padBottom,
                    minHeight: barHeight + padBottom,
                }}
            >
                {items.map((it) => {
                    const active = current === it.target;
                    const iconName = active ? (it.icon as any) : (it.iconOutline ?? (it.icon + "-outline")) as any;
                    return (
                        <TouchableOpacity
                            key={it.key}
                            style={{ alignItems: "center", gap: 4, paddingHorizontal: 8 }}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            accessibilityRole="button"
                            accessibilityLabel={it.label}
                            onPress={() => {
                                onPressTab(it.target, active)
                            }}
                        >
                            <Ionicons name={iconName} size={20} color="#FFFFFF" />
                            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: active ? "800" : "700", opacity: active ? 1 : 0.85 }}>
                                {it.label}
                            </Text>
                            {/* Optional active indicator */}
                            {active ? <View style={{ height: 3, width: 18, borderRadius: 2, backgroundColor: "#FFF", marginTop: 2 }} /> : null}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});

export default BottomNav;
