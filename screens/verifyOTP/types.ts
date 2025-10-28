import { LoginSignupStackParamList } from "@/navigation/loginSignUpStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_VERIFYOTP = NativeStackScreenProps<
    LoginSignupStackParamList,
    "VerifyOTP"
>;

export type VerifyOTPRouteParams = {
    email: string
};