import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";

const useAppReady = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Pre-load fonts, make any API calls you need to do here

                await Font.loadAsync({
                    "FoundryUnieTrial-Italic": require("../../assets/fonts/FoundryUnieTrial-Italic.otf"),
                    "FoundryUnieTrial-Light": require("../../assets/fonts/FoundryUnieTrial-Light.otf"),
                    "FoundryUnieTrial-Regular": require("../../assets/fonts/FoundryUnieTrial-Regular.otf"),
                    "FoundryUnieTrial-Medium": require("../../assets/fonts/FoundryUnieTrial-Medium.otf"),
                    "FoundryUnieTrial-DemiBold": require("../../assets/fonts/FoundryUnieTrial-DemiBold.otf"),
                    "FoundryUnieTrial-Bold": require("../../assets/fonts/FoundryUnieTrial-Bold.otf"),
                    "Aeonik-Italic": require("../../assets/fonts/Aeonik-Italic.otf"),
                    "Aeonik-Light": require("../../assets/fonts/Aeonik-Light.otf"),
                    "Aeonik-Regular": require("../../assets/fonts/Aeonik-Regular.otf"),
                    "Aeonik-Medium": require("../../assets/fonts/Aeonik-Medium.otf"),
                    "Aeonik-SemiBold": require("../../assets/fonts/Aeonik-SemiBold.otf"),
                    "Aeonik-Bold": require("../../assets/fonts/Aeonik-Bold.otf"),

                });

                // Artificially delay for two seconds to simulate a slow loading
                // experience. Please remove this if you copy and paste the code!
                // await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);
    // useEffect(() => {
    //   setAppIsReady(true);
    // }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    return {
        appIsReady,
        onLayoutRootView,
    };
};

export default useAppReady;
