import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  Button,
  ActivityIndicator,
  FAB
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
            </Text> */}
            <Text>
              Jyrkkyys: {route?.steepnessSummaryValue ?? 0} %
            </Text>
            <Text>
              Matka: {route?.steepnessSummaryDistance ?? 0} m
            </Text>
            {route?.hasCobblestone && (
              <Text>
                Reitillä todennäköisesti mukulakiveä
              </Text>
            )}
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
