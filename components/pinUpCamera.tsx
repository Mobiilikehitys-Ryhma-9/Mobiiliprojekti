import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { colors } from "../theme/theme";

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
      setPhotoUri(photo.uri);
    }
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.camera} />

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.surface }]}
            onPress={() => setPhotoUri(null)}
          >
            <Text style={styles.btnText}>Ota uudelleen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: colors.primary, opacity: photosaving ? 0.6 : 1 },
            ]}
            disabled={photosaving}
            onPress={() => {
              if (!photoUri) return;
              onPictureTaken(photoUri);
            }}
          >
            <Text style={[styles.btnText, { color: "white" }]}>
              {photosaving ? "Tallennetaan..." : "Käytä kuvaa"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.surface }]}
          onPress={() => onPictureTaken("")}
        >
          <Text style={styles.btnText}>Takaisin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={takePicture}
        >
          <Text style={[styles.btnText, { color: "white" }]}>Ota kuva</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  btnText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});
