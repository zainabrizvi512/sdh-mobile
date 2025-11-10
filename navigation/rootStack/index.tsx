import Splash from "@/screens/splash";
import { getAccessToken } from "@/storage/tokenStorage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import DashboardStack from "../dashboardStack";
import LoginSignupStack from "../loginSignUpStack";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
    const [ready, setReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await getAccessToken();
                if (token) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error reading accessToken:", error);
                setIsLoggedIn(false);
            } finally {
                setReady(true);
            }
        };

        checkToken();
    }, []);

    if (!ready) {
        // Show splash until token check finishes
        return <Splash onDone={() => { }} />;
    }

    return (
        <NavigationContainer>
            <StatusBar animated style="light" backgroundColor="#fff" />
            <Stack.Navigator
                initialRouteName={isLoggedIn ? "DashboardStack" : "LoginSignupStack"}
                screenOptions={{
                    headerShown: false,
                    animation: "none",
                    gestureEnabled: false,
                }}
            >
                <Stack.Screen name="LoginSignupStack" component={LoginSignupStack} />
                <Stack.Screen name="DashboardStack" component={DashboardStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootStack;
