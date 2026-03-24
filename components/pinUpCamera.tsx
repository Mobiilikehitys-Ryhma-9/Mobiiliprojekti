import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View, Button, Image } from "react-native";
import { useEffect, useState, useRef  } from "react";
import { CameraView, Camera } from "expo-camera";

type Props = {
  onPictureTaken: (uri: string) => void
};

export default function PinUpCamera({onPictureTaken}: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)


useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  if (hasPermission === null) return <View />
  if (hasPermission === false)
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );

  const takePicture = async () => {
    if (cameraRef.current) {
    const photo = await cameraRef.current.takePictureAsync()
    if (photo.uri) {
      setPhotoUri(photo.uri)
    }
  }
};

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.camera} />

        <View style={styles.controls}>
          <Button title="Retake" onPress={() => setPhotoUri(null)} />
          <Button title="Use Photo" onPress={() => onPictureTaken(photoUri)} />
        </View>
      </View>
    );
  }

   return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}/>
      
      <View style={styles.controls}>
        <Button title="Go Back" onPress={() => onPictureTaken("")} />
        <Button title="Take Picture" onPress={takePicture} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1 
},
  camera: {
     flex: 1
},
  btnCamera:{
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
},
controls: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly"
  }
});
