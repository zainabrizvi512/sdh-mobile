import Login from "@/screens/login";
import SandwichAIndex from "@/screens/sandwiches/sandwichAIndex";
import SandwichBIndex from "@/screens/sandwiches/sandwichBIndex";
import SandwichCIndex from "@/screens/sandwiches/sandwichCIndex";
import VerifyOTP from "@/screens/verifyOTP";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { LoginSignupStackParamList } from "./types";

const Stack = createNativeStackNavigator<LoginSignupStackParamList>();

const LoginSignupStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="SandwichA"
            screenOptions={{
                headerShown: false,
                animation: 'none', // 👈 This disables animation globally for this stack
                gestureEnabled: false,
            }}
        >
            <Stack.Screen
                name="SandwichA"
                component={SandwichAIndex}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
            <Stack.Screen
                name="SandwichB"
                component={SandwichBIndex}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
            <Stack.Screen
                name="SandwichC"
                component={SandwichCIndex}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
            <Stack.Screen
                name="VerifyOTP"
                component={VerifyOTP}
                options={{
                    gestureEnabled: false,
                    animation: "none", // <==== LIKE HERE
                }}
            />
        </Stack.Navigator>
    );
};

export default LoginSignupStack;
