import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { TextInput, Button, RadioButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Profile } from "../hooks/useMap"
import { globalStyles } from "../theme/styles";
import { borderRadius, colors, spacing } from "../theme/theme";

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
      style={ showInputs ? styles.toggleButton : styles.toggleButtonClosed }
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
              style={[globalStyles.input, {height: 40}]}
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
              <MaterialIcons name="my-location" size={28} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[globalStyles.input, {height: 40}]}
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
              <Text style={globalStyles.text}>Kävely</Text>
            </View>
            <View style={styles.option}>
              <RadioButton value='wheelchair' />
              <Text style={globalStyles.text}>Pyörätuoli</Text>
            </View>
          </RadioButton.Group>

          <Button
            mode="contained"
            icon="magnify"
            loading={loading}
            disabled={loading}
            style={{ marginTop: spacing.sm, marginLeft: 120 }}
            buttonColor={colors.primary}
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
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.large,
    elevation: 5,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center'
  },
  // input: {
  //   height: 30,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   padding: 10,
  //   margin: 5,
  //   borderRadius: 8,
  //   marginVertical: 4
  // },
  iconBtn: {
    position: 'absolute',
    top: 20,
    right: 10,
    padding: 0
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs
  },
  toggleButton: {
    position: "absolute",
    top: 290,
    left: 20,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 50,
    zIndex: 10,
    elevation: 6,
},
toggleButtonClosed: {
    position: "absolute",
    top: 45,
    left: 20,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
    elevation: 6,
},

})