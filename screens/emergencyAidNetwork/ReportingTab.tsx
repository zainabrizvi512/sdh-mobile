import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styles } from "./styles";
import { Incident } from "./types";

const ReportingTab = ({ baseUrl }: { baseUrl: string }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { setLoading(false) }, 3000);
    fetch(`${baseUrl}/incident-map`)
      .then(res => res.json())
      .then(data => { setIncidents(data); setLoading(false); })
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#4C8DFF" style={{ marginTop: 20 }} />;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.cardTitle}>LIVE INCIDENT MAP</Text>
      <View style={[styles.card, { height: 300, padding: 0, overflow: 'hidden' }]}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: incidents.length > 0 ? incidents[0].location_lat : 33.6844,
            longitude: incidents.length > 0 ? incidents[0].location_lng : 73.0479,
            latitudeDelta: 0.1, longitudeDelta: 0.1,
          }}
        >
          {incidents.map((inc) => (
            <Marker
              key={inc.id}
              coordinate={{ latitude: inc.location_lat, longitude: inc.location_lng }}
              title={inc.text}
              pinColor="red"
            />
          ))}
        </MapView>
      </View>
      <Text style={[styles.cardTitle, { marginTop: 10 }]}>RECENT INCIDENTS</Text>
      {incidents.map((inc) => (
        <View key={inc.id} style={styles.requestRow}>
          <View style={[styles.requestChip, { backgroundColor: '#FFE5E5' }]}><Text style={{ color: '#FF4C4C' }}>SOS</Text></View>
          <View style={styles.requestMeta}>
            <Text style={{ fontWeight: 'bold' }}>{inc.sender?.username || "User"}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>{inc.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ReportingTab;