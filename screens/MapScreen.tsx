import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from "react-native";
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
import PinUpCamera from "../components/pinUpCamera";

import MapControls from "../components/MapControls";
import { MapPin } from "../types/Pin";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

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
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0)
  const [cameraOpen, setCameraOpen] = useState(false);

  const colors = ['#0072B2', '#E69F00', '#009E73']
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

  const selectedRoute = route?.routes?.[selectedRouteIndex]

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
        <>
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
          style={!route ? styles.fabBottom : styles.fabUpper}
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

            <View style={styles.routeSelector}>
              {route?.routes.map((_, index) => (
                <TouchableOpacity key={index}
                  onPress={() => setSelectedRouteIndex(index)}
                  style={[styles.routeButton, index === selectedRouteIndex && styles.routeButtonActive]}
                  >
                    <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: colors[index], marginBottom: 4}} />
                    <Text style={{color: index === selectedRouteIndex ? 'white' : 'black'}}>
                      {`Vaihtoehto ${index + 1}`}
                    </Text>
                  </TouchableOpacity>
              ))}
              </View>

              {selectedRoute && (
                <View style={styles.routeDetails}>
                  {/* <Text>
                    Reitistä laskettu: {route?.steepnessSummaryAmount ?? 0} %
                    </Text> */}
                  <Text>
                    Jyrkkysarvo: {selectedRoute?.steepnessSummaryValue ?? 0}
                  </Text>
                  <Text>
                    Matka: {selectedRoute.steepnessSummaryDistance ?? 0} m
                  </Text>
                  <Text>
                    Enimmäkseen reitti on tyyppiä: {selectedRoute.waytype}
                  </Text>
                </View>
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
    maxHeight: 200
  },
  routeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8
  },
  routeButton: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 8
  },
  routeButtonActive: {
    backgroundColor: '#333'
  },
  routeDetails: {
    marginTop: 5,
  },

  fabUpper: {
    position: "absolute",
    right: 16,
    bottom: 130,
    zIndex: 20,
  },
  fabBottom: {
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