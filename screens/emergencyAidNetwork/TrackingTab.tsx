import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { styles } from "./styles";

type TrackingItem = {
  requestId: string;
  resourceType: string;
  quantity: number;
  createdAt: string;
  status: 'Requested' | 'In Transit' | 'Delivered';
  responder?: {
    vehicle: string;
    ngoName: string;
    statusLabel: string;
  };
};

const TrackingTab = ({ baseUrl, token }: { baseUrl: string, token: string }) => {
  const [trackingList, setTrackingList] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch List Data
  useEffect(() => {
    if (!token) return;

    const fetchTracking = async () => {
      try {
        // Updated endpoint to get ALL requests
        const response = await fetch(`${baseUrl}/tracking`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setTrackingList(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
    const interval = setInterval(fetchTracking, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [token]);

  // 2. Helper for Progress Bar Width
  const getProgressWidth = (status: string) => {
    if (status === 'Delivered') return '100%';
    if (status === 'In Transit') return '66%';
    return '33%'; 
  };

  // 3. Render Individual Card
  const renderTrackingCard = ({ item }: { item: TrackingItem }) => {
    return (
      <View style={[styles.card, { marginBottom: 16 }]}>
        
        {/* Header: Resource Info */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <View>
            <Text style={styles.cardTitle}>
              {item.resourceType.toUpperCase()} <Text style={{fontWeight: '400', color: '#666'}}>x{item.quantity}</Text>
            </Text>
            <Text style={{ fontSize: 10, color: '#999' }}>
              ID: {item.requestId.slice(0, 8).toUpperCase()} • {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          {/* Status Badge */}
          <View style={{ backgroundColor: item.status === 'Delivered' ? '#E8F5E9' : '#FFF3E0', padding: 6, borderRadius: 8, height: 28 }}>
             <Text style={{ fontSize: 10, fontWeight: 'bold', color: item.status === 'Delivered' ? '#4CAF50' : '#FF9800' }}>
               {item.status.toUpperCase()}
             </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={{ marginVertical: 10 }}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: getProgressWidth(item.status), backgroundColor: '#0f4c3a' }]} />
          </View>
          <View style={styles.stageRow}>
            <Text style={[styles.stageText, item.status === 'Requested' && styles.activeStage]}>Requested</Text>
            <Text style={[styles.stageText, item.status === 'In Transit' && styles.activeStage]}>In Transit</Text>
            <Text style={[styles.stageText, item.status === 'Delivered' && styles.activeStage]}>Delivered</Text>
          </View>
        </View>

        {/* Responder Section */}
        {item.responder ? (
          <View style={[styles.requestRow, { marginTop: 10, backgroundColor: '#F9F9F9', borderWidth: 0 }]}>
            <View style={{ marginRight: 10 }}>
               <Ionicons name="medkit-outline" size={20} color="#0f4c3a" />
            </View>
            <View style={{ flex: 1 }}>
               <Text style={styles.td}>{item.responder.vehicle}</Text>
               <Text style={{ fontSize: 10, color: '#666' }}>{item.responder.ngoName}</Text>
            </View>
            <Text style={{ color: '#4CAF50', fontWeight: '700', fontSize: 12 }}>
              {item.responder.statusLabel}
            </Text>
          </View>
        ) : (
          <Text style={{ color: '#999', fontSize: 11, fontStyle: 'italic', marginTop: 5 }}>
            Waiting for NGO assignment...
          </Text>
        )}
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="small" color="#0f4c3a" style={{ marginTop: 20 }} />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={[styles.cardTitle, { marginBottom: 10 }]}>YOUR AID REQUESTS</Text>
      
      {trackingList.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Ionicons name="documents-outline" size={48} color="#CCC" />
          <Text style={{ color: '#999', marginTop: 10 }}>No requests found.</Text>
        </View>
      ) : (
        <FlatList
          data={trackingList}
          keyExtractor={(item) => item.requestId}
          renderItem={renderTrackingCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

// Add these small helper styles to your stylesheet if needed, or keep inline
// styles.stageText = { color: '#999', fontSize: 10, fontWeight: '500' }
// styles.activeStage = { color: '#0f4c3a', fontWeight: 'bold' }

export default TrackingTab;