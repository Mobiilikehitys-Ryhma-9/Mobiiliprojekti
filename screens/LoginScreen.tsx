import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Onnistui", "Kirjautuminen onnistui");
      
    //takaisin alkuun
      navigation.reset({
        index: 0,
        routes: [{ name: "Map" }],
      });

    } catch (error: any) {
      Alert.alert("Virhe", "Väärä sähköposti tai salasana");
    }
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="person" size={64} color="#6200ee" style={styles.icon} />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPassword}>Salasana unohtunut?</Text>
      </TouchableOpacity>

      <Button
        title="Login"
        onPress={handleLogin}
      />

      <View style={styles.signUpContainer}>
        <Text>Etkö ole vielä käyttäjä? </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signUpText}>Luo tili</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff"
  },
  icon: { marginBottom: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "bold", color: "#6200ee" },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9"
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    color: "#6200ee",
    textDecorationLine: "underline"
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center"
  },
  signUpText: {
    fontWeight: "bold",
    color: "#6200ee"
  }
});