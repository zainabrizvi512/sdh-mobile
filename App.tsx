import { Buffer } from "buffer";
import { ActivityIndicator, View } from "react-native";
import { Auth0Provider } from "react-native-auth0";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { envConfig } from "./config/envConfig";
import useAppReady from "./hooks/useAppReady";
import RootStack from "./navigation/rootStack";
if (typeof global.Buffer === "undefined") global.Buffer = Buffer;

export default function App() {
    const { appIsReady, onLayoutRootView } = useAppReady();

    // Show a loading screen while appIsReady is false
    if (!appIsReady)
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#09090B",
                }}
            >
                <ActivityIndicator size="large" color="#A1A1AA" />
            </View>
        );
    return (
        <GestureHandlerRootView onLayout={onLayoutRootView}>
            <Auth0Provider
                domain={envConfig.EXPO_PUBLIC_AUTH0_DOMAIN}
                clientId={envConfig.EXPO_PUBLIC_AUTH0_CLIENT_ID}
            >
                <RootStack />

            </Auth0Provider>
        </GestureHandlerRootView>
    );
}
