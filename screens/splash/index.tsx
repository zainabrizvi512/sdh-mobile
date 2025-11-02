// src/screens/Splash.tsx
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { styles } from "./styles";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Configure how many falling items you want
const FALLING_COUNT = 18;

// Choose the icons you want to fall (tents, relief/medical, money)
const ICON_POOL = [
    { Family: MaterialCommunityIcons, name: "tent", color: "#0C0C0C", size: 22 },
    { Family: MaterialCommunityIcons, name: "cash", color: "#2FBF71", size: 22 },
    { Family: MaterialCommunityIcons, name: "hand-heart", color: "#0C0C0C", size: 20 },
    { Family: Ionicons, name: "medkit", color: "#0C0C0C", size: 20 },
    { Family: FontAwesome5, name: "hand-holding-heart", color: "#0C0C0C", size: 18 },
    { Family: MaterialCommunityIcons, name: "hand-coin", color: "#2FBF71", size: 20 },
];

type DropSpec = {
    x: number;
    delay: number;
    duration: number;
    Icon: React.ComponentType<any>;
    iconName: string;
    color: string;
    size: number;
    rotate: number;
    drift: number;
};

const makeSpec = (): DropSpec => {
    const pool = ICON_POOL[Math.floor(Math.random() * ICON_POOL.length)];
    return {
        x: Math.random() * (SCREEN_W - 32) + 16,
        delay: Math.floor(Math.random() * 1800),
        duration: Math.floor(Math.random() * 2500) + 2800, // 2.8s - 5.3s
        Icon: pool.Family,
        iconName: pool.name,
        color: pool.color,
        size: pool.size + Math.round(Math.random() * 8) - 4,
        rotate: (Math.random() * 40 - 20) * (Math.random() > 0.5 ? 1 : -1),
        drift: Math.random() * 26 - 13,
    };
};

interface SplashProps {
    onDone?: () => void;
    title?: string;
    subtitle?: string;
}

const Splash: React.FC<SplashProps> = ({
    onDone,
    title = "Shelter Disaster Help",
    subtitle = "Preparing resources & safety tools…",
}) => {
    const hasContinuedRef = useRef(false);

    // build drops
    const drops = useMemo(() => Array.from({ length: FALLING_COUNT }, makeSpec), []);
    const progressRefs = useMemo(() => drops.map(() => new Animated.Value(0)), [drops]);

    // loop falling icons forever
    useEffect(() => {
        const stops: Array<() => void> = [];

        progressRefs.forEach((val, i) => {
            const { delay, duration } = drops[i];
            const run = () => {
                val.setValue(0);
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(val, {
                        toValue: 1,
                        duration,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ]).start(() => run());
            };
            run();
            stops.push(() => val.stopAnimation());
        });

        return () => stops.forEach((s) => s());
    }, [drops, progressRefs]);

    // pulsing "Tap to continue"
    const pulse = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [pulse]);

    const ctaOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });

    const handleContinue = () => {
        if (hasContinuedRef.current) return;
        hasContinuedRef.current = true;
        onDone?.();
    };

    return (
        <Pressable style={styles.container} onPress={handleContinue}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            {/* Falling layer */}
            <View style={StyleSheet.absoluteFillObject}>
                {drops.map((spec, i) => {
                    const translateY = progressRefs[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-40, SCREEN_H + 40],
                    });
                    const translateX = progressRefs[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [spec.x, spec.x + spec.drift],
                    });
                    const rotate = progressRefs[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", `${spec.rotate}deg`],
                    });
                    const opacity = progressRefs[i].interpolate({
                        inputRange: [0, 0.05, 0.9, 1],
                        outputRange: [0, 0.8, 0.8, 0],
                    });
                    const IconComp = spec.Icon;

                    return (
                        <Animated.View
                            key={i}
                            style={[
                                styles.drop,
                                {
                                    transform: [{ translateX }, { translateY }, { rotate }],
                                    opacity,
                                },
                            ]}
                        >
                            <IconComp name={spec.iconName} size={spec.size} color={spec.color} />
                        </Animated.View>
                    );
                })}
            </View>

            {/* Center logo/title */}
            <View style={styles.centerWrap}>
                <Text style={styles.brand}>Shelter</Text>
                <Text style={styles.brandAccent}>Disaster Help</Text>
                <Text style={styles.tagline}>Relief. Safety. Dignity.</Text>
            </View>

            {/* Bottom: subtitle + Tap to continue */}
            <View style={styles.footer}>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Animated.Text
                    style={[
                        { marginTop: 8, fontSize: 13, fontWeight: "600", color: "#2FBF71", opacity: ctaOpacity },
                    ]}
                >
                    Tap to continue
                </Animated.Text>
            </View>
        </Pressable>
    );
};

export default Splash;
