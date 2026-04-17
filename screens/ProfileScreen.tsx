import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';

import { auth } from '../services/firebase';

import { useState, useEffect } from "react"
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { View, Text, Image, TextInput, TouchableOpacity, Button, StyleSheet, FlatList } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = BottomTabScreenProps<RootTabParamList, 'Profile'>;


export default function ProfileScreen({ navigation }: Props) {
  
  const [user, setUser] = useState<any>(null);

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((u) => {
    setUser(u);
  });

  return unsubscribe;
}, []);

  const [userAlert, setUserAlerts] = useState([
    {
      id: "1",
      text: "Työmaa tällä alueella, läpikulku mahdoton!",
      area: "Oulu, Linnanmaa"
    },
    {
      id: "2",
      text: "Jokin muu asia kuin työmaa",
      area: "Oulu, Keskusta"
    },
    {
      id: "3",
      text: "Läpikulku mahdoton pyörätuoleille syystä tai toisesta",
      area: "Oulu, Liminka"
    },
  ])

  const [userSettings, setUserSettings] = useState(false);

  // Poistaa valitun itemin listasta
  // Pitää lisätä funktio, jossa poistaa myös firebasesta ilmoituksen
  const deleteItem = (id: string) => {
    setUserAlerts(prev => prev.filter(item => item.id !== id));
  }

  // Tykkäysten määrä myös oletetusti haetaan sitten firebasesta
  const likes = 10

  // Firebase kutsut tänne siten miten itse haluaa onPress funktioiden sisälle
  const menuItems = [
    { label: "Change Username", onPress: () => { } },
    { label: "Change Password", onPress: () => { } },
    { label: "Change Profile Picture", onPress: () => { } },
    { label: "Sign Out", onPress: () => { } },
  ];

  return (

    <View style={styles.container}>
        {user ? (
          // dummy alertit että tietää miltä lista näyttää käytännössä
          // Oikeasti ne sitten haettaisiin firebasesta, joka vaatii oman funktion totta kai..

          <View style={{ flex: 1, backgroundColor: "white" }}>

            <View style={{ alignItems: 'flex-start', width: '100%' }}>
              <TouchableOpacity
                style={styles.sideWidget}
                onPress={() => setUserSettings(!userSettings)}
              >lk
                <Ionicons name="menu" size={32} color="gray" />
              </TouchableOpacity>
            </View>

            <View style={styles.container}>

              {/* Profiilikuva, pitää muuttaa että source on haettu kuva firebasesta tai vastaavasta */}
              <Image
                source={require("../assets/favicon.png")}
                style={styles.profilePicture}
              />

              <View>
                <Text style={styles.username}>Username</Text> {/* Hae käyttäjänimi oikeasti firebasesta */}
                <View style={styles.likeContainer}>
                  <MaterialIcons name="thumb-up" size={24} color="green" />
                  <Text>{likes}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.divider}></Text>

            {/* Tässä itse lista käyttäjän ilmoituksista */}
            <FlatList
              data={userAlert}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.alertBox}>
                  <Text style={styles.areaText}>{item.area}</Text>
                  <Text style={styles.alertText}>{item.text}</Text>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteItem(item.id)}
                  >
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>

                </View>
              )}
            />

            {userSettings && (
              <>
                <View style={styles.centerMenu}>
                  <Text style={styles.menuTitle}>Settings</Text>

                  {menuItems.map((item) => (
                    <TouchableOpacity
                      key={item.label}
                      style={styles.menuButton}
                      onPress={item.onPress}>
                      <Text style={styles.menuButtonText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity onPress={() => setUserSettings(false)}>
                    <Text style={{ marginTop: 20, color: 'red', alignSelf: 'center' }}>Close</Text>
                  </TouchableOpacity>

                </View>
                <View style={styles.globalDarken}>
                </View>
              </>
            )}

          </View >

      ) : (
        <View style={{ alignItems: "center", marginTop: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signUpText}>Kirjaudu sisään</Text>
        </TouchableOpacity>
        </View>
      )}
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    marginTop: 60,
    backgroundColor: "#fff"
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    color: "#6200ee",
    textDecorationLine: "underline"
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
  alertBox: {
    marginTop: 12,
    backgroundColor: "#E8F1FF",
    padding: 12,
    borderRadius: 8,
    margin: 16,
    height: 85,
  },
  alertText: {
    color: "#333",
    fontSize: 14,
  },
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
  sideBarContent: {
    flexDirection: 'column',
    padding: 5,
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
    padding: 12,
    width: '100%',
    borderRadius: 8,
    marginTop: 10,
  },
  menuButtonText: {
    textAlign: 'center',
    fontSize: 16,
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
