import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";

export default function RegisterScreen() {
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("")
    const [passwordMatch, setPasswordMatch] = useState("")
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")

    const checkPassword = (password: string) => {
        // Tarkistaa sisältääkö salasana ison kirjaimen, numeron ja onko vähintään 8 merkkiä pitkä
        // ?=.*[A-Z] = Onko isoa kirjainta missään kohdassa
        // jne...
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
        return passwordRegex.test(password)
    }

    const checkEmail = (email: string) => {
        // Tarkistaa onko syötetty sähköposti oikeassa muodossa: "foo@foo.com"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
    }

    // Nämä useEffektit varmaan voisi tiivistää yhdeksi apufunktioksi, mutta
    // Joku minua viisaampi saa sen tehdä jos häiritsee
    useEffect(() => {
        if (password.length === 0) return setPasswordError("")

        setPasswordError(checkPassword(password)
            ? ""
            : "Salasanassa tulee olla vähintään 8 merkkiä, yksi iso kirjain ja yksi numero.")
    }, [password])

    useEffect(() => {
        if (email.length === 0) return setEmailError("")

        setEmailError(checkEmail(email)
            ? ""
            : "Virheellinen sähköposti osoite.")
    }, [email])

    return (
        <View style={styles.container}>
            < Text style={styles.title}>Luo uusi käyttäjä</Text>

            <Text />
            <TextInput
                style={styles.input}
                placeholder="Nimi"
            />

            {/* Virheilmoitus käyttäjälle näkyviin, mikäli email ei sisällä @ merkkiä */}
            {email.length > 0 && (
                <Text style={{ color: "red", marginBottom: 10 }}>
                    {emailError}
                </Text>
            )}

            <TextInput
                style={[
                    styles.input,
                    emailError ? { borderColor: "red", borderWidth: 2 } : {}
                ]}
                placeholder="Email"
                onChangeText={setEmail}
            />

            {/* Virheilmoitus käyttäjälle näkyviin, mikäli salasana ei seuraa regex ohjeita */}
            {passwordError.length > 0 && (
                <Text style={{ color: "red", marginBottom: 10, alignSelf: "flex-start" }}>
                    {passwordError}
                </Text>
            )}

            <TextInput
                style={[
                    styles.input,
                    passwordError ? { borderColor: "red", borderWidth: 2 } : {}
                ]}
                placeholder="Salasana"
                secureTextEntry
                onChangeText={setPassword}
            />

            {/* Virheilmoitus käyttäjälle näkyviin, mikäli salasanat ei täsmää */}
            {passwordMatch.length > 0 && (
                <Text style={{ color: "red", marginBottom: 10, alignSelf: "flex-start" }}>
                    {passwordMatch}
                </Text>
            )}

            <TextInput
                style={[
                    styles.input,
                    passwordMatch ? { borderColor: "red", borderWidth: 2 } : {}
                ]}
                placeholder="Varmista salasana"
                secureTextEntry
                onChangeText={(text) => {
                    setPasswordMatch(text);
                    setPasswordMatch(text !== password ? "Salasanat eivät täsmää." : "");
                }}
            />

            <TouchableOpacity onPress={() => { /* Navigoi takaisin LoginScreeniin */ }}>
                <Text style={styles.forgotPassword}>Oletko jo käyttäjä? Kirjaudu sisään tästä.</Text>
            </TouchableOpacity>

            <Button title="Jatka"></Button>
            {/* Firebase logiikka, tarkistaa onko sähköposti/käyttäjänimi jo varattu jne. */}
            {/* Siirtyy profiilin teko screeniin, profiilikuvan asettaminen ym.? */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff"
    },
    title: { fontSize: 24, marginBottom: 20, fontWeight: "bold", color: "#6200ee" },
    input: {
        width: "100%",
        padding: 14,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: "#f9f9f9"
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 20,
        color: "#6200ee",
        textDecorationLine: "underline"
    },
});