import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  dateToDateTimeString,
  useAccessibilityAutoFocus
} from '@client/common';

import { BuildStyles, useTheme } from '../../../utils';

type NotificationListSectionHeaderProps = {
  title: string;
  day: string;
};

const NotificationListSectionHeader = ({
  title,
  day
}: NotificationListSectionHeaderProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View
      {...accessibility(
        {
          label: `Grupo de notificaciones del día ${dateToDateTimeString(
            day,
            "dd 'de' MMMM 'de' yyyy"
          )}`,
          role: 'text'
        },
        { accessible: true }
      )}
      style={styles.headerContainer}
    >
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const buildStyles = ({ theme, constants: { FF, FS, RADIUS } }: BuildStyles) =>
  StyleSheet.create({
    container: {},
    headerContainer: {
      padding: 10,
      marginTop: 20,
      marginBottom: 20,
      backgroundColor: theme.backgroundDateChat,
      borderRadius: RADIUS.L,
      alignSelf: 'center'
    },
    title: {
      fontSize: FS.S,
      fontFamily: FF.regular,
      lineHeight: 22,
      color: theme.fontColorNegative
    }
  });

export { NotificationListSectionHeader };
