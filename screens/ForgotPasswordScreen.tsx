import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleReset = () => {
    if (!email) {
      Alert.alert("Virhe", "Syötä sähköposti");
      return;
    }

    setLoading(true);

    // Mock-toiminto: “lähetetään” sähköpostia 1 sekunti
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Sähköposti lähetetty",
        "Jos sähköposti löytyy, saat ohjeet pian."
      );
      navigation.navigate("Login" as never);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Palauta salasana</Text>

      <TextInput
        style={styles.input}
        placeholder="Säköposti"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading} // ei voi kirjoittaa kun loading
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" style={{ marginVertical: 10 }} />
      ) : (
        <Button
          title="Lähetä palautuslinkki"
          onPress={handleReset}
          disabled={!email.trim()} // nappi ei ole aktiivinen jos tyhjä
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});