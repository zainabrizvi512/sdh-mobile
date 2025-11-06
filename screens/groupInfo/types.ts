import { LoginSignupStackParamList } from "@/navigation/loginSignUpStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_GROUPINFO = NativeStackScreenProps<
    LoginSignupStackParamList,
    "GroupInfo"
>;

export type GroupInfoRouteParams = {
};