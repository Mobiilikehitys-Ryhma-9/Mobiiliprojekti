import React from "react";
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <MaterialIcons name="person" size={64} color="#6200ee" style={styles.icon} />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Sähköposti"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput style={styles.input} placeholder="Salasana" secureTextEntry />

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword" as never)}>
       <Text style={styles.forgotPassword}>Salasana unohtunut?</Text>
      </TouchableOpacity>

      <Button title="Login" onPress={() => { /* login-logiikka */ }} />

      <View style={styles.signUpContainer}>
        <Text>Etkö ole vielä käyttäjä? </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}>
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