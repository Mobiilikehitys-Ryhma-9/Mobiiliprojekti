import * as ImagePicker from 'expo-image-picker';

export const takePhoto = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (!permissionResult.granted) {
    alert("Tarvitaan lupa kameran käyttöön!");
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.7,
  });

  if (result.canceled) return null;

  return result.assets[0];
};

export const uploadImage = async (image: any) => {
  const data = new FormData();

  data.append('file', {
    uri: image.uri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);

  data.append('upload_preset', "pins_upload");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dtkhgwg4s/image/upload",
    {
      method: 'POST',
      body: data,
    }
  );

  const result = await response.json();

  return result.secure_url;
};