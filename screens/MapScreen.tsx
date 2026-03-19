import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ActivityIndicator } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Profile, useMap } from '../hooks/useMap';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

export default function MapScreen({ navigation }: Props) {

  const {
    startLocation,
    setStartLocation,
    destination, 
    setDestination,
    routePoints,
    route,
    profile,
    setProfile,
    handleRouteSearch,
    loading
  } = useMap();

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!route?.routeCoords?.length) return;

    mapRef.current?.fitToCoordinates(route.routeCoords, {
      edgePadding: {
        top: 100,
        right: 50,
        bottom: 100,
        left: 50
      },
      animated: true
    });
  }, [route?.routeCoords]);

  return (
    <SafeAreaView style={styles.container}>

      {/* ✅ LOGIN NAPPI */}
      <View style={styles.loginButton}>
        <Button
          title="Kirjaudu sisään"
          onPress={() => navigation.navigate("Login")}
        />
      </View>

      {/* INPUTIT */}
      <TextInput
        style={styles.input}
        placeholder="Lähtö"
        value={startLocation}
        onChangeText={setStartLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Määränpää"
        value={destination}
        onChangeText={setDestination}
      />

      {/* PROFILE VALINTA (yksinkertaistettu) */}
      <View style={styles.optionRow}>
        <Button
          title="Kävely"
          onPress={() => setProfile('foot-walking' as Profile)}
        />
        <Button
          title="Pyörätuoli"
          onPress={() => setProfile('wheelchair' as Profile)}
        />
      </View>

      {/* HAE REITTI */}
      <Button
        title={loading ? "Haetaan..." : "Hae reitti"}
        onPress={handleRouteSearch}
        disabled={loading}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text>Haetaan reittiä...</Text>
        </View>
      )}

      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: (routePoints?.start[1] ?? 65.01),
          longitude: (routePoints?.start[0] ?? 25.47),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {routePoints && (
          <>
            <Marker coordinate={{ latitude: routePoints.start[1], longitude: routePoints.start[0] }} />
            <Marker coordinate={{ latitude: routePoints.end[1], longitude: routePoints.end[0] }} />
          </>
        )}

        {route && (
          <Polyline
            coordinates={route.routeCoords}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>

      <View style={styles.info}>
        <Text>
          Korkeusero: {route ? route.elevation.toFixed(1) : 0.0} m
        </Text>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  loginButton: {
    padding: 8
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 5,
    borderRadius: 8
  },

  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },

  map: {
    flex: 1
  },

  info: {
    padding: 10,
    backgroundColor: 'white'
  }
});