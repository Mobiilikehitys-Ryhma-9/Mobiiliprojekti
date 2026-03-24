import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, } from 'react-native';
import { TextInput, RadioButton, Button, ActivityIndicator} from 'react-native-paper';
import MapView, { Polyline, Marker, Callout } from 'react-native-maps';
import { Profile, useMap } from '../hooks/useMap';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import PinUp from '../components/pinUp';
import { MapPin } from '../types/Pin';
import { FAB } from 'react-native-paper';

export default function MapScreen() {
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
  } = useMap()
  const mapRef = useRef<MapView>(null)
  const isLoggedIn: boolean = false

  const [pins, setPins] = useState<MapPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    if (!route?.routeCoords?.length) return 
    
    mapRef.current?.fitToCoordinates(route.routeCoords, {
      edgePadding: {
        top: 100,
        right: 50,
        bottom: 100,
        left: 50
      },
      animated: true
    })
  }, [route?.routeCoords])

  return (
    <SafeAreaView style={styles.container}>
      <TextInput style={{marginBottom: 2}} 
        placeholder='Lähtö'
        value={startLocation}
        onChangeText={setStartLocation}
        mode='outlined'
        onSubmitEditing={() => {}} />
      <TextInput style={{marginBottom: 2}}
        placeholder='Määränpää'
        value={destination}
        onChangeText={setDestination}
        mode='outlined'
        onSubmitEditing={() => {}} />

      <RadioButton.Group onValueChange={
          (value: string) => setProfile(value as Profile)
        }
        value={profile}>
        <View style={styles.option}>
          <RadioButton value='foot-walking' />
          <Text>Kävely</Text>
        </View>
        <View style={styles.option}>
          <RadioButton value='wheelchair' />
          <Text>Pyörätuoli</Text>
        </View>
      </RadioButton.Group>
      
      <Button mode='contained'
        icon='magnify' 
        loading={loading}
        disabled={loading}
        style={{marginVertical: 8, alignSelf: 'center'}}
        onPress={handleRouteSearch}>
        Hae Reitti
      </Button>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' />
          <Text>Haetaan reittiä...</Text>
        </View>
      )}
      <MapView ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: (routePoints?.start[1] ?? 65.01),
          longitude: (routePoints?.start[0] ?? 25.47),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {routePoints && (
          <>
            <Marker coordinate={{ latitude: routePoints.start[1], longitude: routePoints.start[0] }} />
            <Marker coordinate={{ latitude: routePoints.end[1], longitude: routePoints.end[0] }} />
          </>
        )}
        {route && (
          <Polyline coordinates={route.routeCoords}
            strokeWidth={4}
            strokeColor="blue" />
        )}

  {pins.map((pin, index) => (
  <Marker
    key={index}
    coordinate={{
      latitude: pin.latitude,
      longitude: pin.longitude
    }}
    onPress={() => 
      setSelectedPin(pin)
    }
  >
    <Callout>
      <View style={{ width: 200 }}>
        <Text>{pin.message}</Text>

        {pin.image && (
          <Image
            source={{ uri: pin.image }}
            style={{ width: 180, height: 120 }}
          />
        )}
      </View>
    </Callout>
  </Marker>
))}

{/* {selectedPin && (
  <Marker
    coordinate={{
      latitude: selectedPin.latitude,
      longitude: selectedPin.longitude
    }}
  >
    <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 8 }}>
      <Text>{selectedPin.message}</Text>
      {selectedPin.image && (
        <Image
          source={{ uri: selectedPin.image }}
          style={{ width: 150, height: 150 }}
        />
      )}
    </View>
  </Marker>
)} */}

  {/* {showPinModal && (
  <PinUp
    pins={pins}
    setPins={setPins}
    visible={showPinModal}
    onClose={() => setShowPinModal(false)}
  />
)} */}

</MapView>

<FAB
  icon="plus"
  style={styles.fab}
  onPress={() => {
    setSelectedPin(null);   
    setShowPinModal(true);
  }}
/>

      <View style={styles.info}>
        <Text>
          Reitistä laskettu: {route ? route.steepnessSummaryAmount : 0} %
        </Text>
        <Text>
          Jyrkkyysarvo: {route ? route.steepnessSummaryValue : 0} %
        </Text>
        <Text>
          Etäisyys: {route ? route.steepnessSummaryDistance : 0} m
        </Text>
      </View>

      {showPinModal && (
  <PinUp
    pins={pins}
    setPins={setPins}
    visible={true}
    onClose={() => setShowPinModal(false)}
  />
)}

     {selectedPin && (
      <PinUp
      pins={[selectedPin]}        
      setPins={setPins}
      visible={true}          
      onClose={() => setSelectedPin(null)}
    />
  )}
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4
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
  },
  fab: {
  position: 'absolute',
  right: 16,
  bottom: 16,
  zIndex: 20
}
});