import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { IosAuthorizationStatus } from 'expo-notifications';

import { Ensure } from '../utils/Ensure';
import { registerNotificationPushToken } from './service';

const MESSAGE_DELAY = 1000;

const useRegisterPushNotificationsToken = (userCid360: string): void => {
  useEffect(() => {
    const registerToken = async (): Promise<void> => {
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();

        let hasPermission = existingStatus === 'granted';

        if (!hasPermission) {
          const { status, ios } = await Notifications.requestPermissionsAsync();

          hasPermission =
            (Platform.OS === 'ios' &&
              ios?.status === IosAuthorizationStatus.AUTHORIZED) ||
            status === 'granted';
        }

        if (hasPermission) {
          Ensure.that(
            !hasPermission,
            'NOTIFICACIONES PUSH: Error al obtener el token'
          );

          try {
            const experienceId = (
              __DEV__ ? undefined : Constants.manifest!.extra!.experienceId
            ) as string | undefined;

            const deviceToken = (
              await Notifications.getExpoPushTokenAsync({ experienceId })
            ).data;
            await registerNotificationPushToken(userCid360, deviceToken);
          } catch (error) {
            Alert.alert('Error en notificaciones', `Error: ${error}`);
          }
        } else {
          setTimeout(() => {
            Alert.alert(
              'Permisos notificaciones',
              'Por favor, activa los permisos si quieres que podamos enviarte notificaciones'
            );
          }, MESSAGE_DELAY);
        }

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C'
          });
        }
      } else {
        setTimeout(() => {
          Alert.alert(
            'Push notifications',
            'Must use physical device for Push Notifications'
          );
        }, MESSAGE_DELAY);
      }
    };

    if (userCid360) {
      registerToken();
    }
  }, [userCid360]);
};

export { useRegisterPushNotificationsToken };
