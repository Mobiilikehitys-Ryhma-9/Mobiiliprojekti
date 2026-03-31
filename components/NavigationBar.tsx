import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator, BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';

import MapScreen from '../screens/MapScreen';
import AlertScreen from '../screens/AlertScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type HomeProps = BottomTabScreenProps<RootTabParamList, 'Map'>;

//type HomeTabNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;
//type AlertsTabNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Alerts'>;

const Tab = createBottomTabNavigator<RootTabParamList>();

function MapWrapper(props: HomeProps) {
    return <MapScreen {...props} isLoggedIn={true} />;
}

export default function NavigationBar() {

    return (

        <Tab.Navigator initialRouteName='Map'>

                        <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                    animation: 'fade'
                }}
            />

            <Tab.Screen
                name="Map"
                component={MapWrapper}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="map" size={size} color={color} />
                    ),
                    animation: 'fade'
                }}
            />

            <Tab.Screen name="Alerts" component={AlertScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="warning" size={size} color={color} />
                    ),
                    animation: 'fade'
                }}
            />
        </Tab.Navigator>
    );
}