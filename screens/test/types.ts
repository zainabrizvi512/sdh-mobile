import { LoginSignupStackParamList } from "@/navigation/loginSignUpStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_TEST = NativeStackScreenProps<
    LoginSignupStackParamList,
    "Test"
>;

export type TestRouteParams = {
};