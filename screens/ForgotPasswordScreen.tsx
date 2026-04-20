import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase"; 
import { globalStyles } from "../theme/styles";
import { colors, spacing } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => { 
    if (!email.trim()) {
      Alert.alert("Virhe", "Syötä sähköposti");
      return;
    }

    setLoading(true);

    try { 
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "Sähköposti lähetetty",
        "Saat pian ohjeet salasanan palautukseen."
      );

      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Virhe", "Sähköpostin lähetys epäonnistui");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[globalStyles.container, globalStyles.center]}>
      <Text style={globalStyles.heading}>Palauta salasana</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing.md }} />
      ) : (
        <TouchableOpacity
          style={[globalStyles.button,
            !email.trim() && { opacity: 0.5 }
          ]}
          onPress={handleReset} 
          disabled={!email.trim()}
        >
          <Text style={globalStyles.buttonText}>
            Lähetä palautuslinkki
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // container: { flex: 1, padding: 20, justifyContent: "center" },
  // title: { fontSize: 22, marginBottom: 20 },
  // input: {
  //   borderWidth: 1,
  //   padding: 10,
  //   marginBottom: 15,
  //   borderRadius: 8,
  // },
});