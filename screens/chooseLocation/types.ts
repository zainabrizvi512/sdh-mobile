import { LoginSignupStackParamList } from "@/navigation/loginSignUpStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_CHOOSELOCATION = NativeStackScreenProps<
    LoginSignupStackParamList,
    "ChooseLocation"
>;

export type ChooseLocationRouteParams = {
};