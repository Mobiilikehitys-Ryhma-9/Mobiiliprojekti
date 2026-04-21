import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import { Alert } from "react-native";

import { doc, onSnapshot, collection, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../services/firebase';
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

import { useState, useEffect } from "react"
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { View, Text, Image, TextInput, TouchableOpacity, Button, StyleSheet, FlatList } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/theme';

type Props = BottomTabScreenProps<RootTabParamList, 'Profiili'>;

// ModalWrapper jolla saadaan dynaaminen modal sekä username että password vaihto kutsuille
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
    <View style={globalStyles.container}>
      {user ? (

        <View style={{ flex: 1 }}>

          <View style={{ alignItems: 'flex-start', width: '100%' }}>
            <TouchableOpacity
              style={styles.sideWidget}
              onPress={() => setUserSettings(!userSettings)}
            >
              <Ionicons name="menu" size={32} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

                    {/* Profiilitiedot */}
                    <View style={styles.rowContainer}>
                        <Image source={require("../assets/favicon.png")} style={styles.profilePicture} />

            <View>
              {/* Hae käyttäjänimi oikeasti firebasesta */}
              <Text style={[globalStyles.text, styles.username]}>{userData?.username ?? "Ei nimeä asetettu"}</Text>
              <View style={styles.likeContainer}>
                <MaterialIcons name="thumb-up" size={20} color={colors.primary} />
                <Text style={globalStyles.text}>{userData?.likes}</Text>
              </View>
            </View>
          </View>

                    <View style={styles.divider} />

          {/* Tässä itse lista käyttäjän ilmoituksista */}
          <FlatList
            data={userPins}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[globalStyles.card, styles.alertBox]}>
                <Text style={[globalStyles.text, styles.areaText]}>{item.area}</Text>
                <Text style={[globalStyles.text]}>{item.text}</Text>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteItem(item.id)}
                >
                  <MaterialIcons name="delete" size={22} color="red" />
                </TouchableOpacity>

              </View>
            )}
          />

          {userSettings && (
            <>
              <View style={styles.centerMenu}>
                <Text style={globalStyles.heading}>Asetukset</Text>

                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    style={globalStyles.button}
                    onPress={item.onPress}>
                    <Text style={globalStyles.buttonText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => setUserSettings(false)}>
                  <Text style={globalStyles.link}>Sulje</Text>
                </TouchableOpacity>

              </View>
              <View style={styles.globalDarken}>
              </View>
            </>
          )}

        </View>

      ) : (
        <View style={[globalStyles.container, globalStyles.center]}>
          <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Login")}>
            <Text style={globalStyles.buttonText}>Kirjaudu sisään</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#fff"
  // },

    rowContainer: {
        flexDirection: "row",
        padding: 16,
        marginTop: 10,
        backgroundColor: "#fff"
    },

  // forgotPassword: {
  //   alignSelf: "flex-end",
  //   marginBottom: 20,
  //   color: "#6200ee",
  //   textDecorationLine: "underline"
  // },
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
  alertBox: {
    marginTop: 12,
    backgroundColor: "#E8F1FF",
    padding: 12,
    borderRadius: 8,
    margin: 16,
    height: 85,
  },
  // alertText: {
  //   color: "#333",
  //   fontSize: 14,
  // },
  areaText: {
    marginTop: 4,
    color: "#555",
    fontSize: 12
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  likeContainer: {
    flexDirection: 'row',
    fontSize: 14,
    paddingLeft: 12,
  },
  sideWidget: {
    position: 'absolute',
    alignItems: 'flex-start',
    top: 60,
    left: 325,
    zIndex: 2,
  },
  // sideBarContent: {
  //   flexDirection: 'column',
  //   padding: 5,
  // },
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
  // menuButton: {
  //   backgroundColor: '#eee',
  //   padding: 12,
  //   width: '100%',
  //   borderRadius: 8,
  //   marginTop: 10,
  // },
  // menuButtonText: {
  //   textAlign: 'center',
  //   fontSize: 16,
  // },
  // signUpContainer: {
  //   flexDirection: "row",
  //   marginTop: 20,
  //   alignItems: "center"
  // },
  // signUpText: {
  //   fontWeight: "bold",
  //   color: "#6200ee",
  //   paddingVertical: 16,
  //   paddingHorizontal: 20,
  // },
  //   signUpButton: {
  //   paddingVertical: 16,
  //   paddingHorizontal: 20,
  // }
  cancelText: {
        marginTop: 20,
        color: 'red',
        textAlign: "center"
    },
});