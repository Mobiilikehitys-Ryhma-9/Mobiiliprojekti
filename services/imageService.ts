// import * as ImagePicker from 'expo-image-picker';

// export const takePhoto = async () => {
//   const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//   if (!permissionResult.granted) {
//     alert("Tarvitaan lupa kameran käyttöön!");
//     return null;
//   }

//   const result = await ImagePicker.launchCameraAsync({
//     quality: 0.7,
//   });

//   if (result.canceled) return null;

//   return result.assets[0];
// };

export const uploadImage = async (uri: string): Promise<string> => {
  try {
    const data = new FormData();

    data.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    data.append('upload_preset', "pins_upload");
    data.append("cloud_name", "dtkhgwg4s");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dtkhgwg4s/image/upload",
      {
        method: 'POST',
        body: data,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    const result = await response.json();
    if (!response.ok){
      console.error("Cloudinary error:", result);
      throw new Error("Upload to Cloudinary failed");
    }
    return result.secure_url;
  } catch (err) {
    console.error("Image upload to Cloudinary error:", err);
    throw err;
  }
};