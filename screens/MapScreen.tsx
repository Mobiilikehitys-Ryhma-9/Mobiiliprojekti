import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  Button,
  ActivityIndicator,
  FAB,
  RadioButton,
} from "react-native-paper";
import MapView, { Polyline, Marker } from "react-native-maps";
import { useMap } from "../hooks/useMap";
import { SafeAreaView } from "react-native-safe-area-context";
import PinUp from "../components/pinUp";
import { MapPin } from "../types/Pin";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import PinUpCamera from "../components/pinUpCamera";

import MapControls from "../components/MapControls";
import PinUpCamera from "../components/pinUpCamera";

type Props = NativeStackScreenProps<RootStackParamList, "Map"> & {
  user: any;
};

export default function MapScreen({ navigation, user }: Props) {
  const {
    startLocation,
    setStartLocation,
    destination,
    setDestination,
    routePoints,
    route,
    profile,
    setProfile,
    obstaclePins,
    setObstaclePins,
    handleRouteSearch,
    loading,
    routeWarning
  } = useMap();
  const mapRef = useRef<MapView>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [showInputs, setShowInputs] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!route?.routes?.length) return;

    const allCoords = route.routes.flatMap((r) => r.coords);

    mapRef.current?.fitToCoordinates(allCoords, {
      edgePadding: {
        top: 100,
        right: 50,
        bottom: 200,
        left: 50,
      },
      animated: true,
    });
  }, [route]);

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView
      style={[styles.container, cameraOpen && { paddingBottom: 0 }]}
    >
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

        {obstaclePins.map((pin, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            pinColor="#f57600"
            onPress={() => setSelectedPin(pin)}
          />
        ))}

        {route?.routes?.map((r, index) => {
          const colors = ["#007AFF", "#34C759", "#FF9500"];

          return (
            <Polyline
              key={index}
              coordinates={r.coords}
              strokeWidth={index === 0 ? 4 : 2}
              strokeColor={colors[index] || "gray"}
            />
          );
        })}
      </MapView>

      {!cameraOpen && showInputs && (
        <View style={styles.topPanel}>
          <View style={styles.loginButton}>
            {user ? (
              <Button onPress={handleLogout}>Kirjaudu ulos</Button>
            ) : (
              <Button onPress={() => navigation.navigate("Login")}>
                Kirjaudu sisään
              </Button>
            )}
          </View>

          <MapControls
            startLocation={startLocation}
            setStartLocation={setStartLocation}
            destination={destination}
            setDestination={setDestination}
            profile={profile}
            setProfile={setProfile}
            handleRouteSearch={handleRouteSearch}
            loading={loading} />
        </>
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

          <RadioButton.Group
            onValueChange={(value: string) => setProfile(value as Profile)}
            value={profile}
          >
            <View style={styles.option}>
              <RadioButton value="foot-walking" />
              <Text>Kävely</Text>
            </View>
            <View style={styles.option}>
              <RadioButton value="wheelchair" />
              <Text>Pyörätuoli</Text>
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
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text>Haetaan reittiä...</Text>
        </View>
      )}

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

      {user && !showPinDialog && !cameraOpen && !selectedPin && (
        <FAB
          icon="plus"
          label="Lisää ilmoitus"
          style={styles.fab}
          onPress={() => setShowPinDialog(true)}
        />
      )}

      <PinUp
        pins={obstaclePins}
        setPins={setObstaclePins}
        visible={showPinDialog && !cameraOpen}
        onClose={() => setShowPinDialog(false)}
        onCameraOpen={setCameraOpen}
        imageUri={capturedImage}
        setImageUri={setCapturedImage}
      />

      {cameraOpen && (
        <View style={StyleSheet.absoluteFillObject}>
          <PinUpCamera
            onPictureTaken={(uri) => {
              setCameraOpen(false);
              setShowPinDialog(true);
              if (uri) {
                setCapturedImage(uri);
              }
            }}
          />
        </View>
      )}

      {!cameraOpen && (
        <>
          <View style={styles.info}>
            {routeWarning && (
              <Text>
                {routeWarning}
              </Text>
            )}
            {/* <Text>
              Reitistä laskettu: {route?.steepnessSummaryAmount ?? 0} %
            </Text>
            <Text>Jyrkkyys: {route?.steepnessSummaryValue ?? 0} %</Text>
            <Text>Matka: {route?.steepnessSummaryDistance ?? 0} m</Text>
          </View>
        </>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    minHeight: 600,
  },
  topPanel: {
    position: "absolute",
    top: 30,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    elevation: 5,
  },
  input: {
    height: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 5,
    borderRadius: 8,
    marginVertical: 4,
  },
  option: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  loginButton: {
    padding: 8,
  },

  info: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    backgroundColor: "white",
    padding: 10,
    maxHeight: 80,
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