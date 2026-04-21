import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';

import MapScreen from '../screens/MapScreen';
import AlertScreen from '../screens/AlertScreen';
import ProfileScreen from '../screens/ProfileScreen';

type MapWrapperProps = BottomTabScreenProps<RootTabParamList, 'Kartta'>;

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function NavigationBar({ user }: { user: any }) {

    function MapWrapper(props: MapWrapperProps) {
        return <MapScreen {...props} user={user} />;
    }

    function ProfileWrapper(props: any) {
        return <ProfileScreen {...props} user={user} />;
    }

    return (

        <Tab.Navigator initialRouteName='Kartta'
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#6200ee',}}
        >

            <Tab.Screen name="Profiili" component={ProfileWrapper}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                
                }}
            />

            <Tab.Screen
                name="Kartta"
                component={MapWrapper}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="map" size={size} color={color} />
                    ),
                
                }}
            />

            <Tab.Screen name="Ilmoitukset" component={AlertScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="warning" size={size} color={color} />
                    ),
                    
                }}
            />
        </Tab.Navigator>
    );
}