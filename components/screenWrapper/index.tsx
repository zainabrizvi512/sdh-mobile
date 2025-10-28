import { PRIMARY_BG } from "@/constants/theme";
import { verticalScale } from "@/theme/responsive";
import React, { useEffect, useState } from "react";
import { AccessibilityInfo, Platform, View } from "react-native";
import { ReduceMotion, ReducedMotionConfig } from "react-native-reanimated";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { styles } from "./styles";
import { T_SCREEN_WRAPPER } from "./types";

const ScreenWrapper: React.FC<T_SCREEN_WRAPPER> = ({
    children,
    paddingDisable,
}) => {
    const [reduceAnimationEnable, setReduceAnimationEnable] = useState(false);
    const insets = useSafeAreaInsets();

    const checkReduceMotion = async () => {
        if (Platform.OS === "ios") {
            const isReducedMotion = await AccessibilityInfo.isReduceMotionEnabled();
            if (isReducedMotion) {
                setReduceAnimationEnable(true);
                console.log("Reduce Motion is enabled. Animations are disabled.");
            } else {
                setReduceAnimationEnable(false);
                console.log("Reduce Motion is disabled. Animations are enabled.");
            }
        }
    };
    useEffect(() => {
        if (Platform.OS == "ios") {
            checkReduceMotion();
        }
    }, []);

    return (
        <SafeAreaProvider style={{ backgroundColor: PRIMARY_BG }}>
            {reduceAnimationEnable && (
                <ReducedMotionConfig mode={ReduceMotion.Never} />
            )}
            <View
                style={[
                    styles.mainContainer,
                    {
                        backgroundColor: PRIMARY_BG,
                        paddingTop: insets.top + verticalScale(14), // Status bar + your padding
                        // paddingHorizontal: horizontalScale(32),

                    },
                ]}
            >
                {children}
            </View>
        </SafeAreaProvider>
    );
};

export default ScreenWrapper;
