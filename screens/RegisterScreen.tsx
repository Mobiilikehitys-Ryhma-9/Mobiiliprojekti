import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();

  const handleRegister = () => {
    // Firebase-logiikka tulee myöhemmin
    console.log("Rekisteröinti:", email, password, confirmPassword);
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="person-add" size={64} color="#6200ee" style={styles.icon} />

      <Text style={styles.title}>Luo tili</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Vahvista salasana"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Rekisteröidy" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
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
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  backToLogin: {
    marginTop: 20,
    color: "#6200ee",
    textDecorationLine: "underline",
  },
});