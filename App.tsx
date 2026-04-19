import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
<<<<<<< HEAD
import { StyleSheet, Text, View } from 'react-native';
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'

export default function App() {
  //return <RegisterScreen />
  return <ProfileScreen /> 
}

<<<<<<< Updated upstream
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
=======
  const [user, setUser] = useState<any>(null); 

  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Map">
          {(props) => <MapScreen {...props} user={user} />}
        </Stack.Screen>

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
>>>>>>> Stashed changes
=======
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";

import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import RegisterScreen from "./screens/RegisterScreen";
import MapScreen from "./screens/MapScreen";
import ProfileScreen from "./screens/ProfileScreen";

import NavigationBar from './components/NavigationBar';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Register: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    })

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Main">
          {(props) => <NavigationBar {...props} user={user} />}
        </Stack.Screen>

        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>


      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

>>>>>>> main
