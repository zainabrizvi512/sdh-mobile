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
    const showBottomBar =
        currentRouteName && BOTTOM_BAR_ROUTES.has(currentRouteName as keyof DashboardStackParamList);

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
            </Stack.Navigator>

            {showBottomBar ? <BottomNav /> : null}
        </View>
    );
};

export default DashboardStack;
