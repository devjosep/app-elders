import React, { ReactElement } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

const OfflineScreen = (): ReactElement => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View style={styles.container}>
      <Image
        {...accessibility({ role: 'none' }, { accessible: false })}
        style={styles.image}
        source={require('../assets/images/error.png')}
      />
      <View
        {...accessibility(
          {
            label:
              'Ventana error. Sin conexión a internet. Revisa tu conexión a internet para volver a la aplicación'
          },
          { accessible: true, autoFocus: true }
        )}
      >
        <Text style={styles.title}>Ops!</Text>
        <Text style={styles.description}>No tiene conexión a internet</Text>
      </View>
    </View>
  );
};

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      flex: 1,
      paddingHorizontal: 16,
      justifyContent: 'center'
    },
    image: { alignSelf: 'center', width: 300, height: 300 },
    title: {
      fontFamily: FF.bold,
      color: theme.fontColorBase,
      fontSize: 25,
      lineHeight: 36,
      paddingHorizontal: 8
    },
    description: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.XM,
      lineHeight: 24,
      letterSpacing: 0.3,
      paddingHorizontal: 8
    }
  });

export default OfflineScreen;
