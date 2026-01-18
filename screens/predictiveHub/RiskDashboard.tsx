// RiskDashboard.tsx

import React from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// ✅ correct: import from victory-native
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine } from 'victory-native';

import { usePredictiveHub } from '../../store/predictiveHub.store';

export default function RiskDashboard() {
  const risk = usePredictiveHub(s => s.risk);
  const hazards = usePredictiveHub(s => s.hazards);
  const volume = usePredictiveHub(s => s.volume);

  const barData = Object.values(risk).map((r: any) => ({
    x: r.disasterName, // This will now show "Flood", "Earthquake", etc.
    y: r.score
  }));

  console.log("volume", volume);

  return (
    <View style={{ flex:1 }}>
      <View style={{ height: 220, padding: 12 }}>
        <VictoryChart width={360} height={200}>
          <VictoryAxis />
          <VictoryBar data={barData} />
        </VictoryChart>
        <Text style={{ textAlign:'center', marginTop: 4 }}>Live Risk Scores</Text>
      </View>

      <View style={{ height: 220, paddingHorizontal: 12 }}>
        <VictoryChart width={360} height={200}>
          <VictoryAxis />
          <VictoryLine data={volume.map((v:any) => ({ x: v.h, y: v.c }))} />
        </VictoryChart>
        <Text style={{ textAlign:'center', marginTop: 4 }}>Volunteer Comms (last 12h)</Text>
      </View>

      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} initialRegion={{ latitude: 33.6844, longitude: 73.0479, latitudeDelta: 0.2, longitudeDelta: 0.2 }}>
          {hazards.map((h:any)=> (
            <Marker key={h.id} coordinate={{ latitude: h.location_lat || h.locationLat, longitude: h.location_lng || h.locationLng }} title="Hazard" description={h.text || ''} />
          ))}
        </MapView>
      </View>
    </View>
  );
}
