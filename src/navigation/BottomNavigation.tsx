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
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ED4A5F',
          height: 60,
          paddingBottom: 8
        },
        headerStyle: {
          backgroundColor: '#ED4A5F'
        },
        headerTintColor: '#FFF',
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#CFCFCF'
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
        />
      ))}
    </Tab.Navigator>
  );
};
