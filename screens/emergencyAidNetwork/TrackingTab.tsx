import React from 'react';
import { Text, View } from 'react-native';
import { styles } from "./styles";

const TrackingTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AID DISTRIBUTION TRACK</Text>
        <View style={{ marginVertical: 20 }}>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: '60%' }]} /></View>
          <View style={styles.stageRow}>
            <Text style={{ color: '#4C8DFF', fontWeight: 'bold', fontSize: 10 }}>Requested</Text>
            <Text style={{ color: '#666', fontSize: 10 }}>In Transit</Text>
            <Text style={{ color: '#666', fontSize: 10 }}>Delivered</Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardTitle}>ACTIVE RESPONDERS</Text>
      <View style={styles.requestRow}>
        <Text style={styles.td}>🚑 Ambulance #42</Text>
        <Text style={{ color: '#4CAF50', fontWeight: '700' }}>Approaching</Text>
      </View>
    </View>
  );
};

export default TrackingTab;