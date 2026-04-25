import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { onSnapshot, collection, query, limit } from "firebase/firestore";
import { db } from '../services/firebase';

import { useState, useEffect } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { globalStyles } from '../theme/styles';
import { borderRadius, colors, spacing } from '../theme/theme';

type Props = BottomTabScreenProps<RootTabParamList, 'Ilmoitukset'>;


export default function AlertScreen({ navigation }: Props) {

  const [userPins, setUserPins] = useState<any[]>([]);

  // Hae käyttäjän ilmoitukset firebasesta
  useEffect(() => {

    const q = query(collection(db, "pins"), limit(15));
    return onSnapshot(q, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setUserPins(items);
    });
  }, []);

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={globalStyles.container} >
      <StatusBar style="auto" />
      <FlatList
        data={userPins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.pinCard}>
            <View style={styles.topRow}>

              <View style={styles.pinContent}>
                <View style={styles.pinHeader}>
                  <Text style={globalStyles.heading}>{item.category}</Text>
                  {item.isBlockingRoute && (
                    <MaterialIcons name="block" size={20} color="red" />
                  )}
                </View>

                <Text style={styles.pinMessage}>{item.message}</Text>

                <Text style={styles.pinLocation}>
                  {item.latitude?.toFixed?.(5) ?? "?"},{" "}
                  {item.longitude?.toFixed?.(5) ?? "?"}
                </Text>

                <TouchableOpacity style={[globalStyles.button, {marginVertical: 2,marginTop: spacing.sm, alignSelf: 'flex-start'}]} 
                  onPress={() => navigation.navigate("Kartta", {
                    targetLocation: {
                      latitude: item.latitude,
                      longitude: item.longitude
                    },
                    pin: item
                  })}>
                  <MaterialIcons name="location-on" size={20} color="#fff" />
                  <Text style={globalStyles.buttonText}>Näytä kartalla</Text>
                </TouchableOpacity>
              </View>

              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.pinImage} />
              ) : null}

            </View>

            <View style={styles.bottomContent}>
              <Text style={styles.pinDate}>
                Luotu: {item.createdAt?.toDate?.().toLocaleString?.() ?? "?"}
              </Text>

              <Text style={styles.pinDate}>
                Vanhenee: {item.expiresAt ? new Date(item.expiresAt).toLocaleString() : "?"}
              </Text>
            </View>

          </View>

        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
    marginTop: 5,
  },

  pinCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.medium,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  pinImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 12,
  },

  pinHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  pinMessage: {
    ...globalStyles.text,
    marginBottom: 6,
    flexWrap: "wrap",
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

  pinContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  bottomContent: {
    marginTop: 10,
  },

});