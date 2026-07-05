import { envConfig } from "@/config/envConfig";

export const postJoinNgo = async (token: string, ngoId: string) => {
  try {
    const response = await fetch(`${envConfig.EXPO_PUBLIC_BASE_URL}/ngos/${ngoId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to join NGO");
    }

    return data;
  } catch (error) {
    console.error("Join NGO Error", error);
    throw error;
  }
};