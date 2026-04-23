import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import {
  Button,
  ActivityIndicator,
  FAB,
  RadioButton,
} from "react-native-paper";
import MapView, { Polyline, Marker } from "react-native-maps";
import { useMap } from "../hooks/useMap";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";
import PinUp from "../components/pinUp";
import PinUpCamera from "../components/pinUpCamera";

import MapControls from "../components/MapControls";
import { MapPin } from "../types/Pin";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../types/navigation";

import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { globalStyles } from "../theme/styles";
import { colors, spacing } from "../theme/theme";

type MapScreenProps = BottomTabScreenProps<RootTabParamList, "Kartta"> & {
  user: any;
};

export default function MapScreen({ navigation, route, user }: MapScreenProps) {
  const {
    startLocation,
    setStartLocation,
    destination,
    setDestination,
    routePoints,
    setRoutePoints,
    routeOption,
    setRouteOption,
    profile,
    setProfile,
    obstaclePins,
    setObstaclePins,
    handleRouteSearch,
    loading,
    routeWarning,
  } = useMap();
  const mapRef = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [cameraOpen, setCameraOpen] = useState(false);

  const routeColors = ["#0072B2", "#E69F00", "#009E73"];
  const [showInputs, setShowInputs] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!routeOption?.routes?.length) return;

    const allCoords = routeOption.routes.flatMap((r) => r.coords);

    mapRef.current?.fitToCoordinates(allCoords, {
      edgePadding: {
        top: 100,
        right: 50,
        bottom: 200,
        left: 50,
      },
      animated: true,
    });
    const backAction = () => {
      if (routeOption?.routes?.length) {
        setRouteOption(null);
        setRoutePoints(null);
        setSelectedRouteIndex(0);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [route]);

  useEffect(() => {
    if (!route.params?.targetLocation) return

    const { latitude, longitude } = route.params.targetLocation
    
    mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    })

    if (route.params.pin) {
      setSelectedPin(route.params.pin)
    }

  }, [route.params])

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null
    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') return
      
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      })

      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      }

      setCurrentLocation(coords)

      mapRef.current?.animateToRegion({
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      })

      subscription = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10
      }, (location) => {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        })
      })
    }

    startTracking()

    return () => {
      subscription?.remove()
    }
  }, [])
  
  const selectedRoute = routeOption?.routes?.[selectedRouteIndex] ?? null;

  return (
    <SafeAreaView
      style={[globalStyles.container, cameraOpen && { paddingBottom: 0 }]}
    >
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={false}
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

          {routeOption?.routes?.map((r, index) => {
            return (
              <Polyline
                key={index}
                coordinates={r.coords}
                strokeWidth={index === selectedRouteIndex ? 4 : 2}
                strokeColor={routeColors[index] || "gray"}
              />
            );
          })}
        </MapView>

        {!cameraOpen && showInputs && (
          <>
            <MapControls
              startLocation={startLocation}
              setStartLocation={setStartLocation}
              destination={destination}
              setDestination={setDestination}
              profile={profile}
              setProfile={setProfile}
              handleRouteSearch={handleRouteSearch}
              loading={loading}
            />
          </>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[globalStyles.text, { marginTop: spacing.sm }]}>
              Haetaan reittiä...
            </Text>
          </View>
        )}

        {selectedPin && (
          <View style={[globalStyles.card, styles.bottomSheet]}>
            <Text style={globalStyles.heading}>{selectedPin.message}</Text>

            {selectedPin.image && (
              <Image
                source={{ uri: selectedPin.image }}
                style={styles.sheetImage}
              />
            )}
            <TouchableOpacity
              style={[globalStyles.button, { marginTop: spacing.md }]}
              onPress={() => setSelectedPin(null)}
            >
              <Text style={globalStyles.buttonText}>Sulje</Text>
            </TouchableOpacity>
          </View>
        )}

        {user && !showPinDialog && !cameraOpen && !selectedPin && !route && (
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

        {!cameraOpen && (routeWarning || (routeOption?.routes && routeOption.routes.length > 0)) && (
          <>
            <View style={styles.info}>
              {routeWarning && (
                <Text style={[globalStyles.text, { marginBottom: spacing.sm }]}>
                  {routeWarning}
                </Text>
              )}

              <View style={styles.routeSelector}>
                {routeOption?.routes.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedRouteIndex(index)}
                    style={[
                      styles.routeButton,
                      index === selectedRouteIndex && styles.routeButtonActive,
                    ]}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: routeColors[index],
                        marginBottom: 4,
                      }}
                    />
                    <Text
                      style={{
                        color:
                          index === selectedRouteIndex
                            ? "#fff"
                            : colors.textPrimary,
                      }}
                    >
                      {`Vaihtoehto ${index + 1}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedRoute && (
                <View style={styles.routeDetails}>
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
    minHeight: 500,
  },
  centerFab: {
    position: "absolute",
    right: 16,
    bottom: 180,
    backgroundColor: colors.surface
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  info: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 8
  },
  routeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  routeButton: {
    alignItems: "center",
    padding: 6,
    borderRadius: 8,
  },
  routeButtonActive: {
    backgroundColor: colors.secondary,
  },
  routeDetails: {
    marginTop: 5,
  },

  fabUpper: {
    backgroundColor: colors.surface,
    position: "absolute",
    right: 16,
    bottom: 130,
    zIndex: 20,
  },
  fabBottom: {
    backgroundColor: colors.surface,
    position: "absolute",
    right: 16,
    bottom: 100,
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
  cancelButton: {
    position: "absolute",
    top: 100,
    right: 16,
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 8,
    zIndex: 50,
  },
});
