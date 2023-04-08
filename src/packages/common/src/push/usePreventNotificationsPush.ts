import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useNotifications } from './notificationsStore';

const usePreventNotificationsPush = () => {
  const navigation = useNavigation();
  const setEnableNotifications = useNotifications(
    (s) => s.setEnableNotifications
  );

  useEffect(() => {
    setEnableNotifications(false);

    const focusListener = navigation.addListener('focus', () => {
      setEnableNotifications(false);
    });

    const blurListener = navigation.addListener('blur', () => {
      setEnableNotifications(true);
    });

    return () => {
      focusListener();
      blurListener();
    };
  }, []);
};

export { usePreventNotificationsPush };
