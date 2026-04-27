// DashboardStack.tsx
import AddMembers from "@/screens/addMembers";
import Dashboard from "@/screens/dashboard";
import EmergencyContactsListing from "@/screens/emergencyContactsListing";
import GroupChat from "@/screens/groupChat";
import GroupInfo from "@/screens/groupInfo";
import GroupListing from "@/screens/groupListing";
import GroupMemberListing from "@/screens/groupMemberListing";
import { useNavigationState } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";

import BottomNav from "@/components/bottomNav";
import DisasterResponseFramework from "@/screens/DisasterResponseFramework";
import InteractiveDonationNetwork from "@/screens/InteractiveDonationNetwork";
import UserEnagagementHub from "@/screens/UserEnagagementHub";
import EmergencyAidNetworkHome from "@/screens/emergencyAidNetwork";
import NewsDetails from "@/screens/newsDetails";
import NewsListing from "@/screens/newsListing";
import PredictiveHubIndex from "@/screens/predictiveHub/PredictiveHubIndex";
import ProfileSettings from "@/screens/profileSettings";
import RescueCoordinationSystem from "@/screens/rescueCoordinationSystem";
import RiskLevels from "@/screens/riskLevels";
import SafetyGuideDetail from "@/screens/safetyGuideDetail";
import SafetyGuides from "@/screens/safetyGuides";
import { DashboardStackParamList } from "./types";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

// routes where the bottom bar SHOULD be visible
const BOTTOM_BAR_ROUTES = new Set<keyof DashboardStackParamList>([
    "Dashboard",
]);

const DashboardStack = () => {
    // What's the focused route inside this stack?
    function getActiveRouteName(state: any): string | undefined {
        let current = state;
        while (current?.routes && typeof current.index === "number") {
            const route = current.routes[current.index];
            if (!route?.state) return route?.name; // reached leaf
            current = route.state;                 // go deeper
        }
        return undefined;
    }

    const currentRouteName = useNavigationState((state) => getActiveRouteName(state));
    // If currentRouteName is undefined, it's likely the first mount.
    // We assume it's the initial route ("Dashboard") in that case.
    const effectiveRouteName = currentRouteName?.includes("Dashboard") ? "Dashboard" : currentRouteName;

    const showBottomBar = BOTTOM_BAR_ROUTES.has(effectiveRouteName as keyof DashboardStackParamList);

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                initialRouteName="Dashboard"
                screenOptions={{
                    headerShown: false,
                    animation: "none",
                    gestureEnabled: false,
                }}
            >
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="GroupListing" component={GroupListing} />
                <Stack.Screen name="EmergencyContactsListing" component={EmergencyContactsListing} />

                {/* detail screens (no bottom bar) */}
                <Stack.Screen name="GroupInfo" component={GroupInfo} />
                <Stack.Screen name="GroupMemberListing" component={GroupMemberListing} />
                <Stack.Screen name="AddMembers" component={AddMembers} />
                <Stack.Screen name="GroupChat" component={GroupChat} />
                <Stack.Screen name="SafetyGuides" component={SafetyGuides} />
                <Stack.Screen name="SafetyGuideDetail" component={SafetyGuideDetail} />
                <Stack.Screen name="NewsListing" component={NewsListing} />
                <Stack.Screen name="NewsDetails" component={NewsDetails} />
                <Stack.Screen name="RiskLevels" component={RiskLevels} />
                <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
                <Stack.Screen name="PredictiveHub" component={PredictiveHubIndex} />
                <Stack.Screen name="EmergencyAidNetwork" component={EmergencyAidNetworkHome} />
                <Stack.Screen name="RescueCoordinationSystem" component={RescueCoordinationSystem} />
                <Stack.Screen name="UserEnagagementHub" component={UserEnagagementHub} />
                <Stack.Screen name="DisasterResponseFramework" component={DisasterResponseFramework} />
                <Stack.Screen name="InteractiveDonationNetwork" component={InteractiveDonationNetwork} />
            </Stack.Navigator>

            {showBottomBar ? <BottomNav /> : null}
        </View>
    );
};

export default DashboardStack;
