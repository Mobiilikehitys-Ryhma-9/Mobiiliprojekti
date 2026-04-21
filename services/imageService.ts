import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_PRESET!;

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


export const uploadImage = async (uri: string): Promise<string> => {
  try {
    const data = new FormData();

    data.append("file", {
      uri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);

    data.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", result);
      throw new Error("Upload to Cloudinary failed");
    }

    return result.secure_url;
  } catch (err) {
    console.error("Image upload to Cloudinary error:", err);
    throw err;
  }
};
