import AddMembers from "@/screens/addMembers";
import Dashboard from "@/screens/dashboard";
import GroupChat from "@/screens/groupChat";
import GroupInfo from "@/screens/groupInfo";
import GroupListing from "@/screens/groupListing";
import GroupMemberListing from "@/screens/groupMemberListing";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { DashboardStackParamList } from "./types";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="GroupListing"
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
            <Stack.Screen
                name="GroupListing"
                component={GroupListing}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
            <Stack.Screen
                name="AddMembers"
                component={AddMembers}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
            <Stack.Screen
                name="GroupInfo"
                component={GroupInfo}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
            <Stack.Screen
                name="GroupMemberListing"
                component={GroupMemberListing}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
            <Stack.Screen
                name="GroupChat"
                component={GroupChat}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
        </Stack.Navigator>
    );
};

export default DashboardStack;
