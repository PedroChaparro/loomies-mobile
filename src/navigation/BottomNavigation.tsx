import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeatherIcon from 'react-native-vector-icons/Feather';
import React from 'react';

import { Profile } from '../pages/Profile';
import { UserLoomies } from '../pages/UserLoomies';
import { UserInventory } from '../pages/UserInventory';

const Tab = createBottomTabNavigator();

const Screens = [
  {
    name: 'Profile',
    component: Profile,
    iconName: 'user'
  },
  {
    name: 'Loomies',
    component: UserLoomies,
    iconName: 'github'
  },
  {
    name: 'Inventory',
    component: UserInventory,
    iconName: 'box'
  }
];

export const BottomNavigation = () => {
  return (
    <Tab.Navigator
      /*Prevent going back to the profile tab when the back button is pressed*/
      backBehavior='none'
      initialRouteName='Loomies'
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ED4A5F',
          height: 60,
          paddingBottom: 8
        },
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#CFCFCF',
        headerShown: false
      }}
    >
      {Screens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarIcon: ({ color }) => (
              <FeatherIcon name={screen.iconName} size={20} color={color} />
            )
          }}
          /* Redirect to the Map view if the clicked tab is already active / 
          handle double click */
          listeners={({ navigation }) => ({
            tabPress: () => {
              if (navigation.isFocused()) {
                return navigation.navigate('Map');
              }
            }
          })}
        />
      ))}
    </Tab.Navigator>
  );
};
