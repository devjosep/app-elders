import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

type EmptyListProps = {
  message: string;
};

const EmptyList = ({ message }: EmptyListProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { role, theme, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View
      {...accessibility(
        {
          label: message,
          role: 'text'
        },
        { accessible: true }
      )}
      style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images/emptyBox.png')} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export { EmptyList };

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center'
    },
    imageContainer: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'center',
      paddingBottom: 8
    },
    message: {
      color: theme.bgTertiary,
      fontFamily: FF.regular,
      fontSize: FS.XM,
      paddingHorizontal: 50,
      textAlign: 'center'
    }
  });
