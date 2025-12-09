import { LoginSignupStackParamList } from "@/navigation/loginSignUpStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

/**
 * Make sure your LoginSignupStackParamList includes:
 * setProfile: { email?: string }
 */

export type T_SETPROFILE = NativeStackScreenProps<
  LoginSignupStackParamList,
  "SetProfile"   // ✅ FIXED (was "SetProfile")
>;

export type Gender = "male" | "female" | "other" | "";

export interface ProfileFormState {
  photoUri: string | null;
  fullName: string;
  phone: string;
  gender: Gender;
  dob: Date | null;
  city: string;
}
