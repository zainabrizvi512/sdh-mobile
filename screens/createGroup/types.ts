import { LoginSignupStackParamList } from "@/navigation/loginSignUpStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_CREATEGROUP = NativeStackScreenProps<
    LoginSignupStackParamList,
    "CreateGroup"
>;

export type GroupType = "Public" | "Private" | "Password";

export type CreateGroupRouteParams = {
    visible: boolean;
  onClose: () => void;
  onAddMembers: (payload: { type: GroupType; name: string }) => void;
};