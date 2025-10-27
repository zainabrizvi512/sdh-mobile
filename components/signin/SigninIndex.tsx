// app/(auth)/signin.tsx
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
//const GREEN_DARK = "#173012";
const TEXT = "#0f0f0f";
const MUTED = "#7a7a7a";
const INPUT_BG = "#efefef";
const DANGER = "#d54b4b";
const BORDER = "#e6e6e6";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSignIn = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // TODO: call your auth API here
      // await login(email, password, remember)
      router.replace("/"); // go to app home
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={GREEN} />
        </Pressable>

        {/* Headings */}
        <Text style={styles.title}>Sign In to SDA</Text>
        <Text style={styles.subtitle}>Welcome back! Please enter your details</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
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

        {/* Row: Remember + Forgot */}
        <View style={styles.rowBetween}>
          <Pressable style={styles.rememberWrap} onPress={() => setRemember(!remember)}>
            <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
              {remember && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.rememberText}>Remember Me</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/sandwich1")} hitSlop={6}>
            <Text style={styles.forgot}>Forgot Password</Text>
          </Pressable>
        </View>

        {/* Sign In */}
        <Pressable
          onPress={onSignIn}
          disabled={submitting}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.primaryBtnText}>{submitting ? "Signing In..." : "Sign In"}</Text>
        </Pressable>

        {/* Social buttons */}
        <View style={{ gap: 12, marginTop: 12 }}>
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              styles.socialBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.995 }] },
            ]}
          >
            <AntDesign name="google" size={18} />
            <Text style={styles.socialText}>Continue with Google</Text>
            <View style={{ width: 18 }} />
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              styles.socialBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.995 }] },
            ]}
          >
            <FontAwesome name="apple" size={20} />
            <Text style={styles.socialText}>Continue with Apple</Text>
            <View style={{ width: 18 }} />
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don’t have an account? </Text>
          <Pressable onPress={() => router.push("/signup")} hitSlop={6}>
            {({ pressed }) => (
              <Text style={[styles.footerLink, pressed && { opacity: 0.7 }]}>
                Signup
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
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: TEXT,
    marginTop: 2,
  },
  subtitle: {
    color: MUTED,
    marginTop: 6,
    marginBottom: 18,
    fontSize: 14,
  },
  label: {
    color: TEXT,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderRadius: 28,
    paddingHorizontal: 18,
    backgroundColor: INPUT_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    color: TEXT,
  },
  rowBetween: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rememberWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bdbdbd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  rememberText: {
    color: MUTED,
    fontSize: 13,
  },
  forgot: {
    color: DANGER,
    fontSize: 13,
    fontWeight: "700",
  },
  primaryBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 28,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: Platform.select({ ios: 0.12, android: 0.2 }) as number,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  socialBtn: {
    height: 50,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  socialText: {
    fontSize: 15,
    color: TEXT,
    fontWeight: "600",
  },
  footerRow: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { color: MUTED, fontSize: 13 },
  footerLink: { color: GREEN, fontSize: 13, fontWeight: "800" },
});
