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
import { uploadImage } from "../services/imageService"; //LISÄTTY

type Props = {
  onPictureTaken: (uri: string) => void;
};

export default function PinUpCamera({ onPictureTaken }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (!permission?.granted) {
    requestPermission();
    return <View />;
  }

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo) {
      setPhotoUri(photo.uri);
    }
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.camera} />

        <View style={styles.controls}>
          <Button title="Retake" onPress={() => setPhotoUri(null)} />
          <Button
            title="Use Photo"
            onPress={async () => {
              if (!photoUri) return;

              const image = {
                uri: photoUri,
              };

              const url = await uploadImage(image); //LISÄTTY
              console.log("CLOUDINARY URL:", url);
              onPictureTaken(url); //MUUTETTU (lähetetään URL eikä uri)
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
        <Button title="Go Back" onPress={() => onPictureTaken("")} />
        <Button title="Take Picture" onPress={takePicture} />
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