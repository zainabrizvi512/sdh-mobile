import { getDisasterTypes } from "@/api/getDisasterTypes";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";

const API = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000";

type DisasterTypeOption = { id: string; label: string };


function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ReportIncident() {
  const { getCredentials } = useAuth0();
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [disasterTypeId, setDisasterTypeId] = useState<string | null>(null);
  const [disasterTypes, setDisasterTypes] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  // location
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // form
  const [region, setRegion] = useState("PK-ISB");
  const [text, setText] = useState("");
  const [severity, setSeverity] = useState(3);
  const [waterDepthCm, setWaterDepthCm] = useState<string>("");
  const [peopleAffected, setPeopleAffected] = useState<string>("");

  const canSubmit = useMemo(() => {
    return (
      !!region.trim() &&
      !!disasterTypeId &&
      text.trim().length >= 6 &&
      typeof lat === "number" &&
      typeof lng === "number" &&
      !submitting
    );
  }, [region, disasterTypeId, text, lat, lng, submitting]);

  const fetchTypes = useCallback(async () => {
    try {
      setLoadingTypes(true);
      const { accessToken } = await getCredentials();

      // Assuming getDisasterTypes is a fetch call:
      const data = await getDisasterTypes();
      setDisasterTypes(data);
      if (data.length > 0) setDisasterTypeId(data[0].id); // Set default selection
    } catch (e) {
      console.error("Failed to load types", e);
    } finally {
      setLoadingTypes(false);
    }
  }, [getCredentials]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingLoc(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Location permission is required to report incidents."
          );
          return;
        }
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      } catch (e: any) {
        Alert.alert("Location error", e?.message ?? "Failed to get location");
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, []);

  async function refreshLocation() {
    try {
      setLoadingLoc(true);
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
    } catch (e: any) {
      Alert.alert("Location error", e?.message ?? "Failed to refresh location");
    } finally {
      setLoadingLoc(false);
    }
  }

  async function submit() {
    if (!canSubmit) return;

    const depth = waterDepthCm.trim()
      ? clamp(Number(waterDepthCm), 0, 500)
      : undefined;

    const affected = peopleAffected.trim()
      ? clamp(Number(peopleAffected), 0, 1000000)
      : undefined;

    const payload = {
      region: region.trim(),
      disasterTypeId,
      text: text.trim(),
      severity: clamp(severity, 1, 5),
      lat: lat!,
      lng: lng!,
      waterDepthCm: Number.isFinite(depth) ? depth : undefined,
      peopleAffected: Number.isFinite(affected) ? affected : undefined,
      photoUrls: [],
    };

    try {
      setSubmitting(true);

      const { accessToken } = await getCredentials();
      if (!accessToken) {
        Alert.alert("Login required", "Token missing. Please login again.");
        return;
      }

      console.log("${API}/reports/hazard", `${API}/reports/hazard`);

      const res = await fetch(`${API}/reports/hazard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status} ${errText}`);
      }

      await res.json();

      Alert.alert(
        "Submitted ✅",
        "Your incident report has been saved and broadcast to the region."
      );

      // reset fields
      setText("");
      setWaterDepthCm("");
      setPeopleAffected("");
      setSeverity(3);
    } catch (e: any) {
      Alert.alert("Submit failed", e?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 6 }}>
        Report Incident
      </Text>
      <Text style={{ color: "#666", marginBottom: 14 }}>
        This report will be saved to the database and update the region risk
        dashboard in real time.
      </Text>

      {/* Region */}
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Region Code</Text>
      <TextInput
        value={region}
        onChangeText={setRegion}
        placeholder="e.g. PK-ISB"
        style={{
          borderWidth: 1,
          borderColor: "#DDD",
          borderRadius: 12,
          padding: 12,
          marginBottom: 14,
        }}
      />

      {/* Disaster Type */}
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Disaster Type</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 14 }}>
        {loadingTypes ? (
          <ActivityIndicator style={{ marginBottom: 14 }} />
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 14 }}>
            {disasterTypes.map((d) => (
              <TouchableOpacity
                key={d.id}
                onPress={() => setDisasterTypeId(d.id)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: disasterTypeId === d.id ? "#111" : "#DDD",
                  marginRight: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontWeight: disasterTypeId === d.id ? "700" : "400" }}>
                  {d.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Severity */}
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Severity (1–5)</Text>
      <View style={{ flexDirection: "row", marginBottom: 14 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => setSeverity(n)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: severity === n ? "#111" : "#DDD",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ fontWeight: severity === n ? "700" : "400" }}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Description</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Describe what happened (location, impact, urgency)..."
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#DDD",
          borderRadius: 12,
          padding: 12,
          minHeight: 110,
          marginBottom: 14,
          textAlignVertical: "top",
        }}
      />

      {/* Optional fields */}
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Optional Details</Text>

      <TextInput
        value={waterDepthCm}
        onChangeText={setWaterDepthCm}
        placeholder="Water depth (cm) - optional"
        keyboardType="number-pad"
        style={{
          borderWidth: 1,
          borderColor: "#DDD",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        }}
      />

      <TextInput
        value={peopleAffected}
        onChangeText={setPeopleAffected}
        placeholder="People affected - optional"
        keyboardType="number-pad"
        style={{
          borderWidth: 1,
          borderColor: "#DDD",
          borderRadius: 12,
          padding: 12,
          marginBottom: 14,
        }}
      />

      {/* Location */}
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Your Location</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#DDD",
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
        }}
      >
        {loadingLoc ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginLeft: 10 }}>Getting GPS…</Text>
          </View>
        ) : (
          <>
            <Text style={{ color: "#444" }}>Lat: {lat ?? "—"}</Text>
            <Text style={{ color: "#444" }}>Lng: {lng ?? "—"}</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        onPress={refreshLocation}
        style={{
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#DDD",
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "700" }}>Refresh Location</Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity
        onPress={submit}
        disabled={!canSubmit}
        style={{
          padding: 14,
          borderRadius: 14,
          backgroundColor: canSubmit ? "#111" : "#AAA",
          alignItems: "center",
        }}
      >
        {submitting ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator color="white" />
            <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
              Submitting…
            </Text>
          </View>
        ) : (
          <Text style={{ color: "white", fontWeight: "700" }}>Submit Report</Text>
        )}
      </TouchableOpacity>

      <Text style={{ color: "#777", marginTop: 10, fontSize: 12 }}>
        ⚠️ If testing on real phone, "localhost" won’t work. Use your laptop IP in EXPO_PUBLIC_API.
      </Text>
    </ScrollView>
  );
}
