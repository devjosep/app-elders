import { useEffect, useRef } from 'react';

import * as Notifications from 'expo-notifications';

import { ACTIVE_COLLABORATIONS_KEY, CONVERSATIONS_KEY } from '../chat';
import { queryClient } from '../http';
import { HAS_NOTIFICATIONS_KEY, NOTIFICATIONS_KEY } from '../notifications';
import { useWrapperRef } from '../utils/useWrapperRef';
import { PushNotificationType, PushNotification } from './domain';
import { useNotifications } from './notificationsStore';

const NOTIFICATIONS_TYPES_ALLOW_DISABLED = [
  PushNotificationType.ChatSession
] as PushNotificationType[];

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const notificationType = notification.request.content.data.type as string;

    const enabledNotifications =
      useNotifications.getState().enableNotifications ||
      !NOTIFICATIONS_TYPES_ALLOW_DISABLED.some(
        (x) => x.toString() === notificationType
      );

    if (notificationType !== PushNotificationType.ChatSession) {
      queryClient.invalidateQueries(NOTIFICATIONS_KEY);
      queryClient.invalidateQueries(HAS_NOTIFICATIONS_KEY);
      queryClient.invalidateQueries(ACTIVE_COLLABORATIONS_KEY);
      queryClient.invalidateQueries(CONVERSATIONS_KEY);
    }

    return {
      shouldShowAlert: enabledNotifications,
      shouldPlaySound: enabledNotifications,
      shouldSetBadge: enabledNotifications
    };
  }
});

type Subscription = { remove: () => void };

type UsePushNotificationsParams = {
  type: PushNotificationType;
  onTapNotification: (_: PushNotification) => void;
};

export function usePushNotifications({
  type,
  onTapNotification
}: UsePushNotificationsParams) {
  const subscriptionsRef = useRef<Subscription[]>([]);
  const onTapNotificationRef = useWrapperRef(onTapNotification);

  useEffect(() => {
    subscriptionsRef.current.push(
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;
        const notificationData = data as PushNotification;

        if (notificationData.type === type) {
          onTapNotificationRef.current(notificationData);
        }
      })
    );

    return () => {
      subscriptionsRef.current.forEach(
        Notifications.removeNotificationSubscription
      );
    };
  }, []);
}
