import * as Location from "expo-location";

export const getAddressFromCoords = async (latitude: number, longitude: number) => {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (!results || results.length === 0) return null;

    const place = results[0];

    return {
      name: place.name ?? "",
      street: place.street ?? "",
      district: place.district ?? "",
      city: place.city ?? place.subregion ?? "",
      region: place.region ?? "",
      country: place.country ?? "",
      postalCode: place.postalCode ?? "",
      full:
        `${place.name ?? ""} ${place.street ?? ""} ${place.district ?? ""} ` +
        `${place.city ?? ""} ${place.region ?? ""} ${place.country ?? ""}`,
    };
  } catch (err) {
    console.log("Reverse geocoding error:", err);
    return null;
  }
};
