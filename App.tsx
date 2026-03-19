import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import PinUp from './components/pinUp';
import { useState } from 'react';
import { MapPin } from "./types/Pin";


export default function App() {
  const [pins, setPins] = useState<MapPin[]>([]);

  return (
    <PinUp pins={pins} setPins={setPins} />
  );
}

//tämä on vain testaamista varten - siirretään sitten mapscreeniin