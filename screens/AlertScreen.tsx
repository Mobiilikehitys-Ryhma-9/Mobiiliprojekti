import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from "@expo/vector-icons";
import PinUp from '../components/pinUp';
import { globalStyles } from '../theme/styles';
import { colors, spacing } from '../theme/theme';


const mockAlerts = [
  { id: 1, title: 'Tie suljettu', description: 'Rakennustyömaa', time: '12:30' },
  { id: 2, title: 'Kolari', description: 'Kolari vitostiellä', time: '14:15' },
  { id: 3, title: 'Lumi', description: 'Tiellä on lunta', time: '16:45' },
  { id: 4, title: 'Ruuhka', description: 'Ruuhka moottoritiellä', time: '18:00' },
  { id: 5, title: 'Säävaroitus', description: 'Sade ja tuuli', time: '20:30' },
  { id: 6, title: 'Lumi', description: 'Tiellä on lunta', time: '16:45' },
  { id: 7, title: 'Lumi', description: 'Tiellä on lunta', time: '16:45' },
  { id: 8, title: 'Lumi', description: 'Tiellä on lunta', time: '16:45' },
];

export default function AlertScreen() {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={globalStyles.container} >
      <StatusBar style="auto" />
      <FlatList
        data={mockAlerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alertItem}>
            <View style={globalStyles.row}>
              <MaterialIcons name="warning" size={24} color={colors.primary} style={styles.icon} />
              <Text style={globalStyles.heading}>{item.title}</Text>
            </View>
            <Text style={globalStyles.text}>{item.description}</Text>
            <View style={[globalStyles.row, { marginTop: spacing.sm }]}>
              <TouchableOpacity onPress={() => { }}>
                <Text style={[globalStyles.link, { marginBottom: 0}]}>Kartalla</Text>
              </TouchableOpacity>
              <MaterialIcons name="schedule" size={20} color={colors.textSecondary} style={styles.icon} />
              <Text style={globalStyles.text}>{item.time}</Text>
            </View>
          </View>
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',

  //   width: '100%',
  // },
  alertItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  // alertTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  icon: {
    marginRight: 8,
  },
  // row: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 5,
  //   marginTop: 5,
  // },
  // button: {
  //   marginRight: 12,
  // },
  // buttonText: {
  //   color: '#6200ee',
  //   textDecorationLine: 'underline',
  // },
});