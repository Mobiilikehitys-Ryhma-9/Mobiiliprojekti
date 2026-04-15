import { StyleSheet, Text, TouchableOpacity, View,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';

import { auth } from '../services/firebase';

type Props = BottomTabScreenProps<RootTabParamList, 'Profile'>;


export default function ProfileScreen({ navigation }: Props) {
    const user = auth.currentUser;

    return (
        <SafeAreaView style={styles.container}>
      <View style={styles.signUpContainer}>
        {user ? (  
            <Text>Kirjauduttu sisään</Text>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signUpText}>Kirjaudu sisään</Text>
          </TouchableOpacity>
        )}
      </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
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
