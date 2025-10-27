import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Sandwich2() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/sandwich3");
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {/* Curved-bottom image */}
        <View style={styles.heroWrap}>
          <Image
            // ⬇️ removed the accidental space in the filename path
            source={require("/Users/midhatrizvi/my-sdh-app/assets/images/ sandwich2.png")}
            style={styles.heroImage}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Your Trusted Guide in Times of Disaster</Text>

        {/* Description */}
        <Text style={styles.subtitle}>
          Discover peace of mind with real-time guidance and resources designed
          to keep you safe. Prepare, act and recover with ease.
        </Text>

        {/* Continue Button */}
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.button,
            pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
          ]}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>

        {/* Pager Dots */}
        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
}

const GREEN = "#1f3d18";
const TEXT_DARK = "#0f0f0f";
const TEXT_MUTED = "#5b5b5b";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    // Prevent overlap with the status bar on Android when not using SafeAreaView
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  // 👇 Curved oval-bottom image
  heroWrap: {
    width: width,
    height: width * 1.2,
    marginHorizontal: -20,
    backgroundColor: "#ddd",
    overflow: "hidden",
    borderBottomLeftRadius: width * 0.75,
    borderBottomRightRadius: width * 0.75,
    marginBottom: 30, // gap before title
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    color: TEXT_DARK,
    paddingHorizontal: 10,
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: TEXT_MUTED,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 25,
    alignSelf: "center",
    backgroundColor: GREEN,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  dotsRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#c7c7c7",
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
  },
});
