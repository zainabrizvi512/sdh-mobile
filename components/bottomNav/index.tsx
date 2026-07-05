import { HEADER_GREEN } from "@/components/fancyAppHeader/styles";
import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { RootStackParamList } from "@/navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { memo, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BAR_HEIGHT, styles } from "./styles";

type Item = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
  target: keyof DashboardStackParamList;
};

const TABS: Item[] = [
  { key: "home", label: "Home", icon: "home", iconOutline: "home-outline", target: "Dashboard" },
  { key: "groups", label: "Groups", icon: "people", iconOutline: "people-outline", target: "GroupListing" },
  {
    key: "emergency",
    label: "Emergency",
    icon: "shield-checkmark",
    iconOutline: "shield-checkmark-outline",
    target: "EmergencyAidNetwork",
  },
  {
    key: "rescue",
    label: "Rescue",
    icon: "sync",
    iconOutline: "sync-outline",
    target: "RescueCoordinationSystem",
  },
  {
    key: "predictive",
    label: "Hub",
    icon: "analytics",
    iconOutline: "analytics-outline",
    target: "PredictiveHub",
  },
];

const BottomNav = memo(() => {
  const insets = useSafeAreaInsets();
  const padBottom = Math.max(insets.bottom, 8);
  const items = useMemo(() => TABS, []);

  const rootNav = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const current = route.name as keyof DashboardStackParamList | string;

  const onPressTab = (target: keyof DashboardStackParamList, active: boolean) => {
    if (active) return;
    rootNav.navigate("DashboardStack", { screen: target } as never);
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={[styles.bar, { paddingBottom: padBottom, minHeight: BAR_HEIGHT + padBottom }]}>
        <View style={styles.glow1} />
        <View style={styles.glow2} />
        <View style={styles.glow3} />

        {items.map((it) => {
          const active = current === it.target;
          const iconName = active ? it.icon : it.iconOutline;
          const iconColor = active ? HEADER_GREEN : "#FFFFFF";

          return (
            <TouchableOpacity
              key={it.key}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityLabel={it.label}
              accessibilityState={{ selected: active }}
              onPress={() => onPressTab(it.target, active)}
            >
              <View style={[styles.tabIconWrap, active && styles.tabIconWrapActive]}>
                <Ionicons name={iconName} size={18} color={iconColor} />
              </View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{it.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

BottomNav.displayName = "BottomNav";

export default BottomNav;
