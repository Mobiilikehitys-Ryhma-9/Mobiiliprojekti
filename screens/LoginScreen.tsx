import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { globalStyles } from "../theme/styles";
import { colors, spacing } from "../theme/theme";

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
        routes: [{ name: "Main" }],
      });

    } catch (error: any) {
      Alert.alert("Virhe", "Väärä sähköposti tai salasana");
    }
  };

  return (
    <View style={[globalStyles.container, globalStyles.center]}>
      <MaterialIcons name="person" size={64} color={colors.primary} style={{marginBottom: spacing.lg}} />

      <Text style={globalStyles.heading}>Kirjaudu</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
       onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={globalStyles.link}>Salasana unohtunut?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button}
        onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Kirjaudu</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={globalStyles.text}>Etkö ole vielä käyttäjä? </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[globalStyles.link, {marginBottom: 0}]}>Luo tili</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   padding: 16,
  //   backgroundColor: "#fff"
  // },
  // title: { fontSize: 24, marginBottom: 20, fontWeight: "bold", color: "#6200ee" },
  // input: {
  //   width: "100%",
  //   padding: 12,
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 8,
  //   marginBottom: 10,
  //   backgroundColor: "#f9f9f9"
  // },
  // forgotPassword: {
  //   alignSelf: "flex-end",
  //   marginBottom: 20,
  //   color: "#6200ee",
  //   textDecorationLine: "underline"
  // },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center"
  },
  // signUpText: {
  //   fontWeight: "bold",
  //   color: "#6200ee"
  // }
});