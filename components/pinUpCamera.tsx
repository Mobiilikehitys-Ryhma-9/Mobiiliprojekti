import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

type Props = {
  onPictureTaken: (uri: string) => void;
};

export default function PinUpCamera({ onPictureTaken }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photosaving, setPhotoSaving] = useState(false);

  if (!permission?.granted) {
    requestPermission();
    return <View />;
  }

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo) {
      console.log("Photo taken:", photo.uri); 
      setPhotoUri(photo.uri);
    }
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.camera} />

        <View style={styles.controls}>
          <Button title="Ota uudelleen" onPress={() => setPhotoUri(null)} />

          <Button
            title={photosaving ? "Tallennetaan..." : "Käytä kuvaa"}
            disabled={photosaving}
            onPress={() => {
              if (!photoUri) return;

              
              console.log("Returning local URI to PinUp:", photoUri);
              onPictureTaken(photoUri);
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />

      <View style={styles.controls}>
        <Button title="Takaisin" onPress={() => onPictureTaken("")} />
        <Button title="Ota kuva" onPress={takePicture} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 100,
  },
  camera: {
    flex: 1,
  },
  btnCamera: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
  controls: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
