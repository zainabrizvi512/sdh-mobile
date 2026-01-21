import { envConfig } from "@/config/envConfig";

export interface NGO {
  id: string;
  name: string;
  type: string;
  logoUrl?: string;
  contactPhone?: string;
}

export const getAllNgos = async (token: string): Promise<NGO[]> => {
  try {
    const response = await fetch(`${envConfig.EXPO_PUBLIC_BASE_URL}/ngos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching NGOs: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get NGOs", error);
    return [];
  }
};