import { getRefreshToken, saveTokens } from "@/storage/tokenStorage";
import { useAuth0 } from "react-native-auth0";

async function refreshAccessToken(auth0: ReturnType<typeof useAuth0>) {
    const rt = await getRefreshToken();
    if (!rt) throw new Error("No refresh token");
    const fresh = await auth0.getCredentials(
        "openid profile email offline_access follows.read update:current_user_identities",
        60,
        {
            audience: "https://sdh-api/"
        }
    );

    await saveTokens({
        accessToken: fresh.accessToken,
        refreshToken: fresh.refreshToken ?? rt, // refresh may rotate RT
        accessTokenExpiresAt: fresh.expiresAt ? Math.floor(fresh.expiresAt / 1000) : undefined,
    });

    return fresh.accessToken;
}
