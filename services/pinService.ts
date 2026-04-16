import { db, storage, auth } from "./firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref } from "firebase/storage"
import { MapPin } from "../types/Pin"

export async function saveToFirebase(pin: MapPin) {
    // Myöhemmin tallennetaan kuva erilliseen palveluun
    /*
    if (pin.image) {

    }
    */

    const user = auth.currentUser
    if (!user) return
 
    await addDoc(collection(db, "pins"), {
        message: pin.message,
        //image: imageUrl,
        latitude: pin.latitude,
        longitude: pin.longitude,
        isBlockingRoute: pin.isBlockingRoute,
        category: pin.category,
        expiresAt: pin.expiresAt,
        userEmail: user.email,
        createdAt: serverTimestamp()
    })
}