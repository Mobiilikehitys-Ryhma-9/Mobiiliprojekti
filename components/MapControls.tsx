import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { TextInput, Button, RadioButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Profile } from "../hooks/useMap"

type Props = {
    startLocation: string
    setStartLocation: (v: string) => void
    destination: string
    setDestination: (v: string) => void
    profile: Profile
    setProfile: (v: Profile) => void
    handleRouteSearch: () => void
    loading: boolean
}

export default function MapControls({
    startLocation,
    setStartLocation,
    destination,
    setDestination,
    profile,
    setProfile,
    handleRouteSearch,
    loading
}: Props) {
    const [showInputs, setShowInputs] = useState(true)
    const [loadingLocation, setLoadingLocation] = useState(false)
    
    useEffect(() => {
        const initLocation = async () => {
        setLoadingLocation(true)
        const address = await getCurrentAddress()
        if (address) { setStartLocation(address) }

        setLoadingLocation(false)
        }
        initLocation()
    }, [])

    const getCurrentAddress = async (): Promise<string | null> => {
        try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') return null

        const location = await Location.getCurrentPositionAsync({})

        const address = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }) 

        if (address.length > 0) {
            const res = address[0]
            return `${res.street ?? ''} ${res.streetNumber ?? ''}, ${res.city}`
        }
        return null
        } catch (err) {
        console.error("Location error:", err)
        return null
        }
    }

  return (
  <>
    <Pressable
      style={styles.toggleButton}
      onPress={() => setShowInputs(prev => !prev)}
    >
      <MaterialIcons
        name={showInputs ? "close" : "search"}
        size={26}
        color="white"
      />
    </Pressable>
    
    {showInputs && (
        <View style={styles.container}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={loadingLocation ? "Haetaan sijaintia..." : "Lähtö"}
              value={startLocation}
              onChangeText={setStartLocation}
            />
            <Pressable style={styles.iconBtn}
              disabled={loadingLocation}
              onPress={async () => {
                const address = await getCurrentAddress()
                if (address) setStartLocation(address)
              }}>
              <MaterialIcons name="my-location" size={20} color='gray' />
            </Pressable>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Määränpää"
              value={destination}
              onChangeText={setDestination}
            />
          </View>

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
      </>
    )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 30,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    elevation: 5,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center'
  },
  input: {
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 5,
    borderRadius: 8,
    marginVertical: 4
  },
  iconBtn: {
    position: 'absolute',
    right: 10,
    verticalAlign: 'middle',
    elevation: 10,
    padding: 4
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4
  },
  toggleButton: {
    position: "absolute",
    top: 45,
    right: 20,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
    elevation: 6,
},

})