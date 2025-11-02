import { getLoggedInUser } from "@/api/getLoggedInUser";
import { ArrowBackIcon } from "@/assets/images/svg";
import ScreenWrapper from "@/components/screenWrapper";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    NativeSyntheticEvent,
    Platform,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { styles } from "./styles";
import { T_VERIFYOTP } from "./types";

const OTP_LENGTH = 6;

const VerifyOTP: React.FC<T_VERIFYOTP> = ({ navigation, route }) => {
    const { email } = route.params;
    const [submitting, setSubmitting] = useState(false);
    const [otpArr, setOtpArr] = useState<string[]>(
        Array.from({ length: OTP_LENGTH }, () => "")
    );
    const { authorizeWithEmail } = useAuth0();

    const code = useMemo(() => otpArr.join(""), [otpArr]);

    const inputsRef = useRef<Array<TextInput | null>>([]);

    const setInputRef = useCallback(
        (index: number) => (r: TextInput | null) => {
            inputsRef.current[index] = r; // returns void
        },
        []
    );

    const focusIndex = (i: number) => {
        const ref = inputsRef.current[i];
        if (ref) ref.focus();
    };

    const handleChange = (text: string, index: number) => {
        // If user pasted all digits into one cell
        if (text.length > 1) {
            const chars = text.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
            const next = [...otpArr];
            for (let i = 0; i < OTP_LENGTH; i++) {
                next[i] = chars[i] ?? next[i];
            }
            setOtpArr(next);
            // Focus the next empty cell or the last one
            const firstEmpty = next.findIndex((c) => c === "");
            focusIndex(firstEmpty === -1 ? OTP_LENGTH - 1 : firstEmpty);
            return;
        }

        // Normal single-character input
        const onlyNum = text.replace(/\D/g, "");
        const next = [...otpArr];
        next[index] = onlyNum;
        setOtpArr(next);

        if (onlyNum && index < OTP_LENGTH - 1) {
            focusIndex(index + 1);
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ) => {
        if (e.nativeEvent.key === "Backspace") {
            if (otpArr[index] === "" && index > 0) {
                const next = [...otpArr];
                next[index - 1] = "";
                setOtpArr(next);
                focusIndex(index - 1);
            }
        }
    };

    const onSignIn = async () => {
        if (submitting) return;
        if (code.length !== OTP_LENGTH) {
            // You can show a toast/snackbar here
            return;
        }

        setSubmitting(true);
        try {
            const credentials = await authorizeWithEmail({
                email,
                code,
                audience: "https://sdh-api/",
                scope:
                    "openid profile email offline_access follows.read update:current_user_identities",
                additionalParameters: { responseType: "code" },
            });
            console.log("Logged in with credentials: ", credentials.accessToken)
            const response = await getLoggedInUser(credentials.accessToken);
            console.log("Logged in user: ", response);
            navigation.navigate("ChooseLocation", {});
        } catch (e) {
            console.log("Login error: ", e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
                    <ArrowBackIcon />
                </TouchableOpacity>

                {/* Headings */}
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>
                    We’ve sent a 6-digit code to{" "}
                    <Text style={{ fontWeight: "700" }}>{email}</Text>
                </Text>

                {/* OTP fields */}
                <View style={styles.otpRow}>
                    {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                        <TextInput
                            key={i}
                            ref={setInputRef(i)}
                            value={otpArr[i]}
                            onChangeText={(t) => handleChange(t, i)}
                            onKeyPress={(e) => handleKeyPress(e, i)}
                            keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                            textContentType="oneTimeCode"
                            autoComplete="one-time-code"
                            maxLength={1}
                            returnKeyType={i === OTP_LENGTH - 1 ? "done" : "next"}
                            style={[
                                styles.otpCell,
                                otpArr[i] ? styles.otpCellFilled : styles.otpCellNotFilled,
                            ]}
                            selectionColor="#2d2d2d"
                        />
                    ))}
                </View>

                {/* Continue */}
                <TouchableOpacity
                    onPress={onSignIn}
                    disabled={submitting}
                    style={[styles.primaryBtn, { marginTop: 24 }]}
                >
                    <Text style={styles.primaryBtnText}>
                        {submitting ? "Verifying..." : "Continue"}
                    </Text>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Didn’t get a code? </Text>
                    <TouchableOpacity onPress={() => inputsRef.current[0]?.focus()} hitSlop={6}>
                        <Text>Resend</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default VerifyOTP;
