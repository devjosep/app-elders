import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
// import { BottomTabParamList } from 'types';
import { BottomTabParamList } from '../types';

import {
  usePushNotifications,
  PushNotificationType,
  PushNotification,
  useAuth
} from '@client/common';
// } from '../../utils/common';

import Home from '../../screens/Home';
import { ErrorBoundaryWrapper } from '../shared/components/ErrorBoundaryWrapper';
import { CustomTabBar } from './CustomTabBar';
import { NavigationIcon } from './NavigationIcon';
// import Chats from 'features/chat/Chats';
// import Collaborations from 'features/collaborations/Collaborations';
// import Profile from 'features/profile/view/Profile';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const { cid360 } = useAuth((s) => s.user);

  usePushNotifications({
    type: PushNotificationType.ChatSession,
    onTapNotification: ({ type, payload }: PushNotification) => {
      if (payload.destinationUserId === cid360) {
        navigation.navigate(type, {
          destinationUserId: payload.currentUserId,
          collaborationType: payload.collaborationType
        });
      }
    }
  });

  return (
    <BottomTab.Navigator
      initialRouteName='Home'
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <BottomTab.Screen
        name='Home'
        options={{
          tabBarLabel: 'Inicio',
          tabBarAccessibilityLabel: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <NavigationIcon focused={focused} name='Home' />
          )
        }}
      >
        {ErrorBoundaryWrapper(Home)}
      </BottomTab.Screen>
      <BottomTab.Screen
        name='Collaborations'
        options={{
          tabBarLabel: 'Peticiones',
          tabBarAccessibilityLabel: 'Peticiones',
          tabBarIcon: ({ focused }) => (
            <NavigationIcon focused={focused} name='Collaborations' />
          )
        }}
      >
        {/* {ErrorBoundaryWrapper(Collaborations)} */}
        {ErrorBoundaryWrapper(Home)}
      </BottomTab.Screen>
      <BottomTab.Screen
        name='Messages'
        options={{
          tabBarLabel: 'Mensajes',
          tabBarAccessibilityLabel: 'Mensajes',
          tabBarIcon: ({ focused }) => (
            <NavigationIcon focused={focused} name='Messages' />
          )
        }}
      >
        {/* {ErrorBoundaryWrapper(Chats)} */}
        {ErrorBoundaryWrapper(Home)}
      </BottomTab.Screen>
      <BottomTab.Screen
        name='Profile'
        options={{
          tabBarLabel: 'Perfil',
          tabBarAccessibilityLabel: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <NavigationIcon focused={focused} name='Profile' />
          )
        }}
      >
        {/* {ErrorBoundaryWrapper(Profile)} */}
        {ErrorBoundaryWrapper(Home)}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
};

export { BottomTabNavigator, ErrorBoundaryWrapper };
