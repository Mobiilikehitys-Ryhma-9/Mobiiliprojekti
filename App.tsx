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
      <AlertScreen/>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

