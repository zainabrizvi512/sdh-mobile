import Dashboard from "@/screens/dashboard";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { DashboardStackParamList } from "./types";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                headerShown: false,
                animation: 'none', // 👈 This disables animation globally for this stack
                gestureEnabled: false,
            }}
        >
            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
        </Stack.Navigator>
    );
};

export default DashboardStack;
