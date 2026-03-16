import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useMap } from '../hooks/useMap';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const { 
    destination, 
    setDestination,
    startCoords,
    endCoords, 
    route, 
    geoCodeAddress,
    profile,
    setProfile
  } = useMap()

  return (
    <SafeAreaView style={styles.container}>
      <TextInput placeholder='Määränpää'
        value={destination}
        onChangeText={setDestination}
        onSubmitEditing={async () => {
          await geoCodeAddress()
        }} />
      <View style={styles.options}>
        <Pressable style={styles.option}
          onPress={() => setProfile('foot-walking')}>
            <Text>{profile === 'foot-walking' ? '⚫' : '⚪'} Kävely</Text>
        </Pressable>
        <Pressable style={styles.option}
          onPress={() => setProfile('wheelchair')}>
            <Text>{profile === 'wheelchair' ? '⚫' : '⚪'} Pyörätuoli</Text>
        </Pressable>
      </View>
      <MapView style={styles.map}
        initialRegion={{
          latitude: startCoords[1],
          longitude: startCoords[0],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        <Marker coordinate={{ latitude: startCoords[1], longitude: startCoords[0] }} />
        <Marker coordinate={{ latitude: endCoords[1], longitude: endCoords[0] }} />
        {route && (
          <Polyline coordinates={route.routeCoords}
            strokeWidth={4}
            strokeColor="blue" />
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
  container: {
    flex: 1
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    padding: 10
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6
  },
  map: {
    flex: 1
  },
  info: {
    padding: 10,
    backgroundColor: 'white'
  }
});
