import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  TextInput,
  RadioButton,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import MapView, { Polyline, Marker, Callout } from "react-native-maps";
import { Profile, useMap } from "../hooks/useMap";
import { SafeAreaView } from "react-native-safe-area-context";
import PinUp from "../components/pinUp";
import { MapPin } from "../types/Pin";
import { FAB } from "react-native-paper";

type MapProps = {
  isLoggedIn: boolean;
};

export default function MapScreen({ isLoggedIn }: MapProps) {
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
    loading,
  } = useMap();
  const mapRef = useRef<MapView>(null);
  const [pins, setPins] = useState<MapPin[]>([]);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    if (!route?.routeCoords?.length) return;

    mapRef.current?.fitToCoordinates(route.routeCoords, {
      edgePadding: {
        top: 100,
        right: 50,
        bottom: 100,
        left: 50,
      },
      animated: true,
    });
  }, [route?.routeCoords]);

  return (
    <SafeAreaView
      style={[styles.container, cameraOpen && { paddingBottom: 0 }]}
    >
      <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <TextInput
          style={{ marginBottom: 2 }}
          placeholder="Lähtö"
          value={startLocation}
          onChangeText={setStartLocation}
          mode="outlined"
          onSubmitEditing={() => {}}
        />
        <TextInput
          style={{ marginBottom: 2 }}
          placeholder="Määränpää"
          value={destination}
          onChangeText={setDestination}
          mode="outlined"
          onSubmitEditing={() => {}}
        />

        <RadioButton.Group
          onValueChange={(value: string) => setProfile(value as Profile)}
          value={profile}
        >
          <View style={styles.optionRow}>
            <View style={styles.optionItem}>
              <RadioButton value="foot-walking" />
              <Text>Kävely</Text>
            </View>
            <View style={styles.optionItem}>
              <RadioButton value="wheelchair" />
              <Text>Pyörätuoli</Text>
            </View>
          </View>
        </RadioButton.Group>

        <Button
          mode="contained"
          icon="magnify"
          loading={loading}
          disabled={loading}
          style={{ marginVertical: 8, alignSelf: "center" }}
          onPress={handleRouteSearch}
        >
          Hae Reitti
        </Button>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text>Haetaan reittiä...</Text>
        </View>
      )}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: routePoints?.start[1] ?? 65.01,
          longitude: routePoints?.start[0] ?? 25.47,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {routePoints && (
          <>
            <Marker
              coordinate={{
                latitude: routePoints.start[1],
                longitude: routePoints.start[0],
              }}
            />
            <Marker
              coordinate={{
                latitude: routePoints.end[1],
                longitude: routePoints.end[0],
              }}
            />
          </>
        )}

        {pins.map((pin, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            onPress={() => setSelectedPin(pin)}
          ></Marker>
        ))}

        {route && (
          <Polyline
            coordinates={route.routeCoords}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>

      {selectedPin && (
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>{selectedPin.message}</Text>

          {selectedPin.image && (
            <Image
              source={{ uri: selectedPin.image }}
              style={styles.sheetImage}
            />
          )}

          <Button onPress={() => setSelectedPin(null)}>Sulje</Button>
        </View>
      )}

      {isLoggedIn && !showPinDialog && !cameraOpen && !selectedPin && (
        <FAB
          icon="plus"
          label="Lisää ilmoitus"
          style={styles.fab}
          onPress={() => setShowPinDialog(true)}
        />
      )}

      <PinUp
        pins={pins}
        setPins={setPins}
        visible={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        onCameraOpen={setCameraOpen}
      />
      {!cameraOpen && (
        <>
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
          <StatusBar style="auto" />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginVertical: 6,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  map: {
    flex: 1,
  },
  info: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    backgroundColor: "white",
    padding: 10,
    zIndex: 10,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    zIndex: 20,
  },
  pinPopup: {
    width: 180,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
    zIndex: 30,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sheetImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
});
