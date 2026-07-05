import { getLoggedInUser } from "@/api/getLoggedInUser";
import AppLogo from "@/components/appLogo";
import BackButton from "@/components/backButton";
import ScreenWrapper from "@/components/screenWrapper";
import { envConfig } from "@/config/envConfig";
import { MUTED } from "@/constants/theme";
import { saveTokens } from "@/storage/tokenStorage";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import DeviceInfo from 'react-native-device-info';
import { styles } from "./styles";
import { T_LOGIN } from "./types";

const Login: React.FC<T_LOGIN> = ({ navigation }) => {
    const domain = envConfig.EXPO_PUBLIC_AUTH0_DOMAIN;
    const appId = DeviceInfo.getBundleId(); // returns bundle id on both platforms

    const defaultRedirectUri =
        Platform.OS === 'ios'
            ? `${appId}://${domain}/ios/${appId}/callback`
            : `${appId}://${domain}/android/${appId}/callback`;

    console.log('Auth0 redirectUri used:', defaultRedirectUri);
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { sendEmailCode, authorize } = useAuth0();

    const onSignIn = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await sendEmailCode({
                email: email.trim(), send: "code", connection: "email", authParams: {
                    audience: envConfig.EXPO_PUBLIC_AUTH0_AUDIENCE,
                }
            });
            navigation.navigate("VerifyOTP", { email: email.trim() });
        } catch (e) {
            console.log("Login error: ", e);
        } finally {
            setSubmitting(false);
        }
    };

    const onSocialLogin = async (connectionType: string) => {
        const credentials = await authorize(
            {
                connection: connectionType,
                audience: "https://sdh-api/",
                scope:
                    "openid profile email offline_access follows.read update:current_user_identities",
                additionalParameters: { responseType: "code" },
            },
            { ephemeralSession: true }
        );
        console.log("Logged in with credentials: ", credentials);
        await saveTokens({
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken ?? null,
            accessTokenExpiresAt: credentials.expiresAt
                ? Math.floor(credentials.expiresAt / 1000)
                : undefined,
        });
        await getLoggedInUser(credentials.accessToken);
        navigation.navigate("ChooseLocation", {});
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.heroWrap}>
                    <View style={styles.decorGlowTop} pointerEvents="none" />
                    <View style={styles.decorGlowBottom} pointerEvents="none" />

                    <BackButton onPress={() => navigation.goBack()} />

                    <View style={styles.logoBadge}>
                        <AppLogo size={56} />
                    </View>

                    {/* Headings */}
                    <Text style={styles.title}>Sign In to SDH</Text>
                    <Text style={styles.subtitle}>Welcome back! Please enter your details</Text>
                </View>

                {/* Email */}
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrap}>
                    <Ionicons name="mail-outline" size={18} color={MUTED} />
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email address"
                        placeholderTextColor="#b9b9b9"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.inputInner}
                    />
                </View>

                {/* Sign In */}
                <TouchableOpacity
                    onPress={onSignIn}
                    disabled={submitting}
                    style={[styles.primaryBtn]}
                >
                    <Text style={styles.primaryBtnText}>{submitting ? "Sending OTP..." : "Continue"}</Text>
                    {!submitting && <Ionicons name="arrow-forward" size={18} color="#fff" />}
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social buttons */}
                <View style={{ gap: 12 }}>
                    <TouchableOpacity
                        onPress={() => { onSocialLogin("google-oauth2") }}
                        style={[styles.primaryBtn, styles.socialMediaBtn]}
                    >
                        <AntDesign name="google" size={18} />
                        <Text style={styles.socialText}>Continue with Google</Text>
                        <View style={{ width: 18 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
}

export default Login;