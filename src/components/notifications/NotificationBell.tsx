import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { BuildStyles } from 'src/utils';

import {
  useAppStateActions,
  useGetUnreadNotificationsCountQuery
} from '@client/common';
import { useAccessibilityAutoFocus } from '@client/common/src/shared/hooks/useAccessibilityAutoFocus';

import BellIcon from '../../../assets/icons/bell.svg';
import { useTheme } from '../../utils/useTheme';

type NotificationBellProps = {
  onPress: () => void;
};

const NotificationBell = ({ onPress }: NotificationBellProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, constants } = useTheme();
  const styles = buildStyles({ theme, constants });

  const {
    data: notificationCount,
    refetch
  } = useGetUnreadNotificationsCountQuery();
  const hasNotifications = (notificationCount ?? 0) > 0;

  useAppStateActions({
    onActiveFromBackground: () => {
      refetch();
    }
  });

  return (
    <TouchableOpacity
      {...accessibility(
        {
          label: 'Notificaciones',
          hint: `${
            hasNotifications
              ? 'Tienes notificaciones nuevas.'
              : 'No tienes notificaciones nuevas.'
          } Ir a notificaciones.`,
          role: 'button'
        },
        { accessible: true }
      )}
      onPress={onPress}>
      <View style={styles.container}>
        <BellIcon width={32} height={32} color={theme.bgSecondary} />
        {hasNotifications ? (
          <>
            <View style={styles.alertDot} />
            <Text style={styles.textDot}>{`( ${notificationCount} )`}</Text>
          </>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const buildStyles = ({
  theme,
  constants: { FF, FS }
}: Pick<BuildStyles, 'theme' | 'constants'>) =>
  StyleSheet.create({
    container: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    },
    alertDot: {
      height: 12,
      width: 12,
      position: 'absolute',
      top: 6,
      right: 12,
      borderRadius: 6,
      backgroundColor: theme.secondary
    },
    textDot: {
      fontFamily: FF.semiBold,
      color: theme.bgSecondary,
      fontSize: FS.XS
    }
  });

export { NotificationBell };
