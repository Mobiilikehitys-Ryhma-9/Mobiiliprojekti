import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyDTIhCCo8y14hoXdscIYEdE6aDfjJLE4io",
  authDomain: "mobiiliprojekti-9e594.firebaseapp.com",
  projectId: "mobiiliprojekti-9e594",
  storageBucket: "mobiiliprojekti-9e594.firebasestorage.app",
  messagingSenderId: "53653476081",
  appId: "1:53653476081:web:219b44657a0de813018f50"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 