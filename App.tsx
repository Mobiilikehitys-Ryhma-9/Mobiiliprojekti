import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapScreen from './screens/MapScreen';
import NavigationBar from './components/NavigationBar';
import { NavigationContainer } from '@react-navigation/native';

/*export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <MapScreen isLoggedIn={true} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}*/

export default function App() {
  return (
    <NavigationContainer>
      <NavigationBar />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },  
});
