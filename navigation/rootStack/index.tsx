import Splash from "@/screens/splash";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import LoginSignupStack from "../loginSignUpStack";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
    const [ready, setReady] = useState(false);

    if (!ready) {
        return <Splash onDone={() => setReady(true)} />;
    }
    return (
        <NavigationContainer>
            <StatusBar
                animated
                style="light"
                backgroundColor={"fff"}
            />
            <Stack.Navigator
                initialRouteName={"LoginSignupStack"}
                screenOptions={{
                    headerShown: false,
                    animation: "none",
                    gestureEnabled: false,
                }}
            >
                <Stack.Screen name="LoginSignupStack" component={LoginSignupStack} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootStack;


