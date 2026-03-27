import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator, BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';

import MapScreen from '../screens/MapScreen';
import AlertScreen from '../screens/AlertScreen';

export type HomeProps = BottomTabScreenProps<RootTabParamList, 'Home'>;

//type HomeTabNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;
//type AlertsTabNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Alerts'>;

const Tab = createBottomTabNavigator<RootTabParamList>();

function MapWrapper(props: HomeProps) {
    return <MapScreen {...props} isLoggedIn={true} />;
}

export default function NavigationBar() {

    return (

        <Tab.Navigator>
            <Tab.Screen
                name="Home"
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