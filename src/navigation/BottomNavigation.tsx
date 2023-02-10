import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeatherIcon from 'react-native-vector-icons/Feather';
import React from 'react';

import { Profile } from '../pages/Profile';
import { UserLoomies } from '../pages/UserLoomies';
import { UserInventory } from '../pages/UserInventory';

const Tab = createBottomTabNavigator();

export const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ED4A5F'
        },
        headerStyle: {
          backgroundColor: '#ED4A5F'
        },
        headerTintColor: '#FFF',
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#CFCFCF'
      }}
    >
      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <FeatherIcon name='user' size={20} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Loomies'
        component={UserLoomies}
        options={{
          tabBarIcon: ({ color }) => (
            <FeatherIcon name='user' size={20} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Inventory'
        component={UserInventory}
        options={{
          tabBarIcon: ({ color }) => (
            <FeatherIcon name='box' size={20} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};
