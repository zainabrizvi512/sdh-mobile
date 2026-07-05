import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styles } from "./styles";

type Incident = {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  risk_type: string;
  source: string;
};

const ReportingTab = ({ baseUrl, token }: { baseUrl: string, token: string }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Ref to control the Map programmatically
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!token) return;

    const fetchIncidents = async () => {
      try {
        const response = await fetch(`${baseUrl}/incidents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setIncidents(data);
      } catch (error) {
        console.error("Failed to load incidents", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [token]);

  const handleSelectIncident = (incident: Incident) => {
    setSelectedId(incident.id);
    mapRef.current?.animateToRegion({
      latitude: incident.latitude,
      longitude: incident.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  if (loading) return <ActivityIndicator size="large" color="#0f4c3a" style={{ marginTop: 20 }} />;

  return (
    // 1. Root Container is a View (Not ScrollView)
    <View style={{ flex: 1, padding: 20 }}>
      
      {/* 2. FIXED TOP SECTION (Map) */}
      <View>
        <Text style={styles.cardTitle}>LIVE INCIDENT MAP</Text>
        <View style={[styles.card, { height: 300, padding: 0, overflow: 'hidden' }]}>
            <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={{
                latitude: incidents.length > 0 ? incidents[0].latitude : 33.6844,
                longitude: incidents.length > 0 ? incidents[0].longitude : 73.0479,
                latitudeDelta: 0.1, longitudeDelta: 0.1,
            }}
            >
            {incidents.map((inc) => {
                const isSelected = inc.id === selectedId;
                return (
                <Marker
                    key={inc.id}
                    coordinate={{ latitude: inc.latitude, longitude: inc.longitude }}
                    title={inc.risk_type || "Incident"}
                    description={inc.description}
                    pinColor={isSelected ? 'green' : (inc.risk_type === 'SOS' ? 'red' : 'orange')}
                />
                );
            })}
            </MapView>
        </View>
      </View>

      {/* 3. SCROLLABLE BOTTOM SECTION (List) */}
      <Text style={[styles.cardTitle, { marginTop: 10 }]}>RECENT INCIDENTS</Text>
      
      {/* Use FlatList for better performance with scrollable lists */}
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }} // Bottom padding for scrolling
        renderItem={({ item: inc }) => {
            const isSelected = inc.id === selectedId;
            return (
                <TouchableOpacity 
                    onPress={() => handleSelectIncident(inc)}
                    activeOpacity={0.7}
                >
                <View 
                    style={[
                        styles.requestRow, 
                        isSelected && { borderColor: '#0f4c3a', borderWidth: 2, backgroundColor: '#F4F9F4' } 
                    ]}
                >
                    <View style={[styles.requestChip, { backgroundColor: inc.risk_type === 'SOS' ? '#FFE5E5' : '#FFF4E5' }]}>
                    <Text style={{ color: inc.risk_type === 'SOS' ? '#FF4C4C' : '#FF9800', fontSize: 10, fontWeight: 'bold' }}>
                        {inc.risk_type || "ALERT"}
                    </Text>
                    </View>
                    <View style={styles.requestMeta}>
                    <Text style={{ fontWeight: 'bold', color: isSelected ? '#0f4c3a' : '#000' }}>
                        {inc.source === 'USER_SOS' ? "User Alert" : "System Alert"}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }} numberOfLines={1}>
                        {inc.description}
                    </Text>
                    </View>
                    {isSelected && <Text style={{ fontSize: 16 }}>✅</Text>}
                </View>
                </TouchableOpacity>
            );
        }}
      />
    </View>
  );
};

export default ReportingTab;