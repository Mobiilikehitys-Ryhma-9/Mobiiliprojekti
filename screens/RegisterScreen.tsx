import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // ✅ validoinnit
  const checkEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const checkPassword = (password: string) => {
    // vähintään 8 merkkiä, yksi iso kirjain ja numero
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    if (email.length === 0) return setEmailError("");
    setEmailError(checkEmail(email) ? "" : "Virheellinen sähköposti");
  }, [email]);

  useEffect(() => {
    if (password.length === 0) return setPasswordError("");
    setPasswordError(
      checkPassword(password)
        ? ""
        : "Salasanassa oltava 8 merkkiä, iso kirjain ja numero"
    );
  }, [password]);

  useEffect(() => {
    if (confirmPassword.length === 0) return setConfirmError("");
    setConfirmError(
      confirmPassword === password ? "" : "Salasanat eivät täsmää"
    );
  }, [confirmPassword, password]);

  const handleRegister = () => {
    if (emailError || passwordError || confirmError) {
      console.log("Virheitä lomakkeessa");
      return;
    }

    // Firebase-logiikka myöhemmin
    console.log("Rekisteröinti:", email, password);

    // esim. siirrytään loginiin rekisteröinnin jälkeen
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="person-add" size={64} color="#6200ee" style={styles.icon} />

      <Text style={styles.title}>Luo tili</Text>

      {/* Email */}
      <TextInput
        style={[styles.input, emailError ? { borderColor: "red" } : {}]}
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      {/* Password */}
      <TextInput
        style={[styles.input, passwordError ? { borderColor: "red" } : {}]}
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {/* Confirm Password */}
      <TextInput
        style={[styles.input, confirmError ? { borderColor: "red" } : {}]}
        placeholder="Vahvista salasana"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {confirmError ? <Text style={styles.error}>{confirmError}</Text> : null}

      <Button title="Rekisteröidy" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.backToLogin}>Takaisin kirjautumiseen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  icon: { marginBottom: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "bold", color: "#6200ee" },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
  },
  error: {
    color: "red",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  backToLogin: {
    marginTop: 20,
    color: "#6200ee",
    textDecorationLine: "underline",
  },
});