import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapScreen from './screens/MapScreen';
import LoginScreen from './screens/LoginScreen';
import AlertScreen from './screens/AlertScreen';
import PinUp from './components/pinUp';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
<<<<<<< HEAD
      <AlertScreen/>
=======
      <MapScreen isLoggedIn={true} />
>>>>>>> 12d01a774a38f6a4bdbef5fedc1ad0524345b548
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

