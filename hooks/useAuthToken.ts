import { getLoggedInUser } from "@/api/getLoggedInUser";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useAuth0 } from "react-native-auth0";

export function useAuthToken() {
  const { getCredentials } = useAuth0();
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadToken = useCallback(async () => {
    try {
      const creds = await getCredentials();
      if (!creds?.accessToken) {
        setToken("");
        setError("Please sign in to load data.");
        return "";
      }

      await getLoggedInUser(creds.accessToken);
      setToken(creds.accessToken);
      setError(null);
      return creds.accessToken;
    } catch (err: any) {
      setToken("");
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to authenticate.");
      return "";
    } finally {
      setIsReady(true);
    }
  }, [getCredentials]);

  useFocusEffect(
    useCallback(() => {
      setIsReady(false);
      loadToken();
    }, [loadToken]),
  );

  return { token, isReady, error, reloadToken: loadToken };
};
