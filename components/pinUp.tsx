import { StyleSheet, Text, View, Modal, Pressable, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import React, { useState } from 'react';
import * as Location from 'expo-location';
import PinUpCamera from './pinUpCamera';
import { MapPin } from "../types/Pin";
import { Picker } from '@react-native-picker/picker';

type Props = {
  pins: MapPin[];
  setPins: React.Dispatch<React.SetStateAction<MapPin[]>>;
  visible: boolean
  onClose: () => void
};

export default function PinUp({ pins, setPins, visible, onClose }: Props) {
  const [ModalVisible, setModalVisible] = useState(false)
  const [Pinmessage, setPinmessage] = useState('')
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [showCamera, setShowCamera] = useState(false);
  const [isSaving, setIsSaving] = useState(false)
  const [category, setCategory] = useState<"short" | "medium" | "long">("medium")

  const CATEGORY_DURATION = {
    short: 1 * 60 * 1000,     // 1 min
    medium: 5 * 60 * 1000,    // 5 min
    long: 60 * 60 * 1000      // 1 h
  }

  const savePin = async () => {
    if (isSaving) return

    if (!Pinmessage.trim() && !imageUri) return

    setIsSaving(true)

    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log("Permission denied")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const duration = CATEGORY_DURATION[category]

      const newPin: MapPin = {
        message: Pinmessage,
        image: imageUri,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        category: category,
        expiresAt: Date.now() + duration
      };

      setPins(prev => [...prev, newPin])
      setPinmessage('')
      setImageUri(undefined)
      onClose()

    } finally {
      setIsSaving(false)
    }
  };

  const cancelPin = () => {
    setPinmessage('')
    setImageUri(undefined)
    onClose()
  };

  const handlePictureTaken = (uri: string) => {
    setShowCamera(false)
    if (uri) {
      setImageUri(uri)
    }
    setModalVisible(true)
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      setPins(prev => prev.filter(pin => pin.expiresAt > now))
    }, 1000)

    return () => clearInterval(interval)
  }, [setPins])

  if (showCamera) {
    return <PinUpCamera onPictureTaken={handlePictureTaken} />
  }

  return (
    <View style={styles.container}>
      {/*       <Pressable
        style={styles.openButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.showText}>Add Pin</Text>
      </Pressable> */}

      <Modal
        animationType='slide'
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>

        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <TextInput style={styles.writePin}
              placeholder='text'
              value={Pinmessage}
              onChangeText={setPinmessage}
            />


            <Pressable
              style={styles.cameraButton}
              onPress={() => {
                onClose()
                setTimeout(() => setShowCamera(true), 50)
              }}
            >
              <Text style={styles.closeText}>Camera</Text>
            </Pressable>

            <View style={styles.picker}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue:"short" | "medium" | "long") =>
                  setCategory(itemValue as "short" | "medium" | "long")}
              >
                <Picker.Item label='Tien este (1 min)' value='short' />
                <Picker.Item label='Liikenne (5 min)' value='medium' />
                <Picker.Item label='Maasto (1 hour)' value='long' />
              </Picker>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={savePin}
              disabled={isSaving}>
              <Text style={styles.closeText}>
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </Pressable>

            <Pressable
              onPress={cancelPin}>
              <Text style={styles.closeText}>Cancel</Text>
            </Pressable>

            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={{ width: 120, height: 120, marginBottom: 10 }}
              />
            )}

          </View>
        </View>
      </Modal>

      {pins.map((pin, index) => (
        <View key={index}
          style={{ marginTop: 20 }}>
          <Text>Messag: {pin.message}</Text>

          <Text>Location: {pin.latitude}, {pin.longitude}</Text>

          {pin.image && (
            <Image
              source={{ uri: pin.image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showText: {
    fontSize: 16,
    fontWeight: '500'
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',

  },
  modalView: {
    height: '50%',
    width: '90%',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 20,
    borderRadius: 5
  },
  modalText: {
    marginBottom: 15,
    fontWeight: '500'
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontWeight: '500'
  },
  closeText: {
    fontWeight: '500'
  },
  openButton: {

  },
  writePin: {

  },
  cameraButton: {

  },
  picker: {
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8
  }
});