import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import { Alert } from "react-native";

import { doc, onSnapshot, collection, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../services/firebase';
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

import { useState, useEffect } from "react";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";

type Props = BottomTabScreenProps<RootTabParamList, 'Profiili'>;

// Yhteinen modal wrapperi, joka poistaa kaiken toiston
const ModalWrapper = ({ title, children, onClose }: any) => (
    <>
        <View style={styles.centerMenu}>
            <Text style={styles.menuTitle}>{title}</Text>
            {children}
            <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.globalDarken} />
    </>
);

export default function ProfileScreen({ navigation }: Props) {

    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [userPins, setUserPins] = useState<any[]>([]);

    const [newUsername, setNewUsername] = useState("");
    const [showUsernameModal, setShowUsernameModal] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [userSettings, setUserSettings] = useState(false);

    // Haetaan kirjautunut käyttäjä
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
        return unsubscribe;
    }, []);

    // Hae käyttäjä tiedot firebasesta
    useEffect(() => {
        if (!user) return;

        const ref = doc(db, "users", user.uid);
        return onSnapshot(ref, (snap) => {
            if (snap.exists()) setUserData(snap.data());
        });
    }, [user]);

    // Hae käyttäjän ilmoitukset firebasesta
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "pins"), where("userEmail", "==", user.email));
        return onSnapshot(q, (snap) => {
            const items: any[] = [];
            snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
            setUserPins(items);
        });
    }, [user]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (e) {
            console.log("Virhe uloskirjautumisessa:", e);
        }
    };

    // Poistaa käyttäjän ilmoituksen
    const deleteItem = (id: string) => {
        Alert.alert(
            "Poistetaanko ilmoitus?",
            "Tätä toimintoa ei voi perua.",
            [
                { text: "Peruuta", style: "cancel" },
                {
                    text: "Poista",
                    style: "destructive",
                    onPress: async () => await deleteDoc(doc(db, "pins", id))
                }
            ]
        );
    };

    const changeUsername = async (newName: string) => {
        if (!user) return;

        try {
            const ref = doc(db, "users", user.uid);
            await updateDoc(ref, { username: newName });
            Alert.alert("Onnistui", "Käyttäjänimi päivitetty!");
        } catch (e) {
            console.log("Virhe käyttäjänimen päivityksessä:", e);
            Alert.alert("Virhe", "Käyttäjänimeä ei voitu päivittää.");
        }
    };

    const menuItems = [
        { label: "Change Username", onPress: () => setShowUsernameModal(true) },
        { label: "Change Password", onPress: () => setShowPasswordModal(true) },
        { label: "Change Profile Picture", onPress: () => { } },
        { label: "Sign Out", onPress: handleSignOut },
    ];

    return (
        <View style={styles.container}>
            {user ? (
                <View style={{ flex: 1, backgroundColor: "white" }}>

                    {/* Asetusvalikon avaus */}
                    <View style={{ alignItems: 'flex-start', width: '100%' }}>
                        <TouchableOpacity
                            style={styles.sideWidget}
                            onPress={() => setUserSettings(!userSettings)}
                        >
                            <Ionicons name="menu" size={32} color="gray" />
                        </TouchableOpacity>
                    </View>

                    {/* Profiilitiedot */}
                    <View style={styles.rowContainer}>
                        <Image source={require("../assets/favicon.png")} style={styles.profilePicture} />

                        <View>
                            <Text style={styles.username}>{userData?.username ?? "Ei nimeä asetettu"}</Text>
                            <View style={styles.likeContainer}>
                                <MaterialIcons name="thumb-up" size={24} color="green" />
                                <Text>{userData?.likes ?? 0}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Käyttäjän ilmoitukset */}
                    <FlatList
                        data={userPins}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.pinCard}>
                                {item.image && (
                                    <Image source={{ uri: item.image }} style={styles.pinImage} />
                                )}

                                <View style={styles.pinHeader}>
                                    <Text style={styles.pinCategory}>{item.category}</Text>
                                    {item.isBlockingRoute && (
                                        <MaterialIcons name="block" size={20} color="red" />
                                    )}
                                </View>

                                <Text style={styles.pinMessage}>{item.message}</Text>
                                <Text style={styles.pinLocation}>
                                    {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                                </Text>

                                <Text style={styles.pinDate}>
                                    Luotu: {item.createdAt?.toDate?.().toLocaleString?.() ?? "?"}
                                </Text>

                                <Text style={styles.pinDate}>
                                    Vanhenee: {new Date(item.expiresAt).toLocaleString()}
                                </Text>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteItem(item.id)}
                                >
                                    <MaterialIcons name="delete" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    {/* Asetusvalikko */}
                    {userSettings && (
                        <ModalWrapper title="Settings" onClose={() => setUserSettings(false)}>
                            {menuItems.map((item) => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={styles.menuButton}
                                    onPress={item.onPress}
                                >
                                    <Text style={styles.menuButtonText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ModalWrapper>
                    )}

                </View>
            ) : (
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.signUpText}>Kirjaudu sisään</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Username modal */}
            {showUsernameModal && (
                <ModalWrapper
                    title="Change Username"
                    onClose={() => {
                        setShowUsernameModal(false);
                        setNewUsername("");
                    }}
                >
                    <TextInput
                        placeholder="New username"
                        value={newUsername}
                        onChangeText={setNewUsername}
                        style={styles.inputField}
                    />

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => {
                            changeUsername(newUsername);
                            setShowUsernameModal(false);
                            setNewUsername("");
                        }}
                    >
                        <Text style={styles.menuButtonText}>Save</Text>
                    </TouchableOpacity>
                </ModalWrapper>
            )}

            {/* Password modal */}
            {showPasswordModal && (
                <ModalWrapper
                    title="Change Password"
                    onClose={() => {
                        setShowPasswordModal(false);
                        setOldPassword("");
                        setNewPassword("");
                    }}
                >
                    <TextInput
                        placeholder="Current password"
                        secureTextEntry
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        style={styles.inputField}
                    />

                    <TextInput
                        placeholder="New password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        style={styles.inputField}
                    />

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={async () => {
                            try {
                                if (!auth.currentUser) return;

                                const credential = EmailAuthProvider.credential(
                                    auth.currentUser.email!,
                                    oldPassword
                                );

                                await reauthenticateWithCredential(auth.currentUser, credential);
                                await updatePassword(auth.currentUser, newPassword);

                                Alert.alert("Onnistui", "Salasana päivitetty!");
                                setShowPasswordModal(false);
                                setOldPassword("");
                                setNewPassword("");

                            } catch (e) {
                                Alert.alert("Virhe", "Salasanan vaihto epäonnistui.");
                                console.log(e);
                            }
                        }}
                    >
                        <Text style={styles.menuButtonText}>Save</Text>
                    </TouchableOpacity>
                </ModalWrapper>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    rowContainer: {
        flexDirection: "row",
        padding: 16,
        marginTop: 10,
        backgroundColor: "#fff"
    },

    profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },

    username: {
        fontSize: 18,
        fontWeight: "bold",
        paddingLeft: 12,
        paddingTop: 15
    },

    divider: {
        height: 1,
        backgroundColor: '#666',
        width: '90%',
        marginBottom: 20,
        marginLeft: 25,
    },

    likeContainer: {
        flexDirection: 'row',
        paddingLeft: 12,
    },

    sideWidget: {
        position: 'absolute',
        top: 60,
        left: 325,
        zIndex: 2,
    },

    globalDarken: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        opacity: 0.5,
        zIndex: 5,
    },

    centerMenu: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -150 }],
        width: '80%',
        maxWidth: 350,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        zIndex: 1000,
        elevation: 10,
    },

    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    menuButton: {
        backgroundColor: '#eee',
        padding: 8,
        width: '100%',
        borderRadius: 8,
        marginTop: 10,
    },

    menuButtonText: {
        textAlign: 'center',
        fontSize: 16,
    },

    cancelText: {
        marginTop: 20,
        color: 'red',
        textAlign: "center"
    },

    signUpText: {
        fontWeight: "bold",
        color: "#6200ee",
        paddingVertical: 16,
        paddingHorizontal: 20,
    },

    signUpButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },

    pinCard: {
        backgroundColor: "#fff",
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    pinImage: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 10,
    },

    pinHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },

    pinCategory: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444",
    },

    pinMessage: {
        fontSize: 15,
        marginBottom: 6,
        color: "#333",
    },

    pinLocation: {
        fontSize: 13,
        color: "#666",
        marginBottom: 4,
    },

    pinDate: {
        fontSize: 12,
        color: "#999",
    },

    deleteButton: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 4,
        borderRadius: 50,
    },

    inputField: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 20
    }
});
