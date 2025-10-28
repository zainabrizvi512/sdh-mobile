import { LoginSignupStackParamList } from "@/navigation/loginSignUpStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_LOGIN = NativeStackScreenProps<
    LoginSignupStackParamList,
    "Login"
>;

export type LoginRouteParams = {
};