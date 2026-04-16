import { db, storage, auth } from "./firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref } from "firebase/storage"
import { MapPin } from "../types/Pin"

export async function saveToFirebase(pin: MapPin) {


    const user = auth.currentUser
    if (!user) return
 
    await addDoc(collection(db, "pins"), {
        message: pin.message,
        image: pin.image, 
        latitude: pin.latitude,
        longitude: pin.longitude,
        category: pin.category,
        expiresAt: pin.expiresAt,
        userEmail: user.email,
        createdAt: serverTimestamp()
    })
}