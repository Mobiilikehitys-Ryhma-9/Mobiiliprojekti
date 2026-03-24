import { StyleSheet, Text, View, Modal, Pressable, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import React, { useState } from 'react';
import PinUpCamera from './pinUpCamera';
import { MapPin } from "../types/Pin";

type Props = {
  pins: MapPin[];
  setPins: React.Dispatch<React.SetStateAction<MapPin[]>>;
  location: {
    latitude: number;
    longitude: number;
  }
};

export default function PinUp({ pins, setPins, location }: Props) {
  const [ModalVisible, setModalVisible] = useState(false)
  const [Pinmessage, setPinmessage] = useState('')
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [showCamera, setShowCamera] = useState(false);

  const savePin = () => {
    if (!Pinmessage.trim() && !imageUri) return;

    const newPin: MapPin = {
      message: Pinmessage,
      image: imageUri,
      latitude: location.latitude,
      longitude: location.longitude
    };

    setPins([...pins, newPin]);
    setPinmessage('')
    setImageUri(undefined)
    setModalVisible(false)
  };

  const cancelPin = () => {
    setPinmessage('');
    setImageUri(undefined);
    setModalVisible(false);
  };

  const handlePictureTaken = (uri: string) => {
    setShowCamera(false);
    if (uri) {
      setImageUri(uri);
    }
    setModalVisible(true);
  };

  if (showCamera) {
    return <PinUpCamera onPictureTaken={handlePictureTaken} />;
  }

  return (
    <>
      <Pressable
        style={styles.openButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.showText}>Add Pin</Text>
      </Pressable>

      <Text>Message: {Pinmessage}</Text>

      <Modal
        animationType='slide'
        transparent={true}
        visible={ModalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}>
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
                setModalVisible(false);
                setShowCamera(true);
              }}
            >
              <Text style={styles.closeText}>Ota kuva</Text>
            </Pressable>

            <Pressable
              style={styles.closeButton}
              onPress={savePin}>
              <Text style={styles.closeText}>Tallenna</Text>
            </Pressable>

            <Pressable
              onPress={cancelPin}>
              <Text style={styles.closeText}>Peruuta</Text>
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
        <View key={index} style={{ marginTop: 20 }}>
          <Text>{pin.message}</Text>

          {pin.image && (
            <Image
              source={{ uri: pin.image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
      ))}
    </>
  );
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

  }
});