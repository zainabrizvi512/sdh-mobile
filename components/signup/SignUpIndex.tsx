// app/(auth)/signup.tsx
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const GREEN = "#1f3d18";
const TEXT = "#0f0f0f";
const MUTED = "#7a7a7a";
const INPUT_BG = "#efefef";
const BORDER = "#e6e6e6";

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSignUp = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // TODO: call your sign up API here
      // await signup({ fullName, email, password })
      router.replace("/"); // go to app home
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Back */}
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={GREEN} />
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>Sign Up</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="#b9b9b9"
          style={styles.input}
        />

        {/* Email */}
        <Text style={[styles.label, { marginTop: 14 }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          placeholderTextColor="#b9b9b9"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        {/* Password */}
        <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#b9b9b9"
          secureTextEntry
          style={styles.input}
        />

        {/* Terms */}
        <Text style={styles.terms}>
          By signing up, you agree to our{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/")}
          >
            Terms of service
          </Text>{" "}
          and{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/")}
          >
            Privacy Policy
          </Text>.
        </Text>

        {/* Sign Up */}
        <Pressable
          onPress={() => {
            onSignUp();              // perform signup action
            router.push("/location");  // navigate after success
          }}
          disabled={submitting}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.primaryBtnText}>
            {submitting ? "Creating Account..." : "Sign Up"}
          </Text>
        </Pressable>


        {/* Social buttons */}
        <View style={{ gap: 12, marginTop: 12 }}>
          <Pressable
            onPress={() => { }}
            style={({ pressed }) => [
              styles.socialBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.995 }] },
            ]}
          >
            <AntDesign name="google" size={18} />
            <Text style={styles.socialText}>Continue with Google</Text>
            <View style={{ width: 18 }} />
          </Pressable>

          <Pressable
            onPress={() => { }}
            style={({ pressed }) => [
              styles.socialBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.995 }] },
            ]}
          >
            <FontAwesome name="apple" size={20} />
            <Text style={styles.socialText}>Continue with Apple</Text>
            <View style={{ width: 20 }} />
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.push("/screens/login/index")} hitSlop={6}>
            {({ pressed }) => (
              <Text style={[styles.footerLink, pressed && { opacity: 0.7 }]}>
                Sign In
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 8 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#f3f3f3", marginBottom: 8,
  },
  title: {
    fontSize: 34, lineHeight: 40, fontWeight: "800",
    color: TEXT, marginTop: 2, marginBottom: 6,
  },
  label: {
    color: TEXT, fontSize: 14, marginBottom: 8, fontWeight: "600",
  },
  input: {
    height: 48, borderRadius: 28, paddingHorizontal: 18,
    backgroundColor: INPUT_BG,
    borderWidth: StyleSheet.hairlineWidth, borderColor: BORDER,
    color: TEXT,
  },
  terms: {
    marginTop: 12, color: MUTED, fontSize: 12, lineHeight: 18,
  },
  link: {
    color: GREEN, fontWeight: "800",
    textDecorationLine: "none",
  },
  primaryBtn: {
    marginTop: 18, height: 52, borderRadius: 28,
    backgroundColor: GREEN, alignItems: "center", justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: Platform.select({ ios: 0.12, android: 0.2 }) as number,
    shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  socialBtn: {
    height: 50, borderRadius: 28, borderWidth: 1, borderColor: BORDER,
    backgroundColor: "#fff",
    alignItems: "center", justifyContent: "space-between",
    flexDirection: "row", paddingHorizontal: 16,
  },
  socialText: { fontSize: 15, color: TEXT, fontWeight: "600" },
  footerRow: {
    marginTop: 26, flexDirection: "row",
    justifyContent: "center", alignItems: "center",
  },
  footerText: { color: MUTED, fontSize: 13 },
  footerLink: { color: GREEN, fontSize: 13, fontWeight: "800" },
});
