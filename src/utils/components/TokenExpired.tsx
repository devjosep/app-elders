import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { useAccessibilityAutoFocus, useAuth } from '@client/common';

import { useTheme, BuildStyles } from '../utils';
import { Button } from './Button';

const TokenExpired = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });
  const signOut = useAuth((u) => u.signOut);
  const setIsTokenExpired = useAuth((u) => u.setIsTokenExpired);

  useEffect(() => {
    signOut();
  }, []);

  return (
    <View style={styles.container}>
      <View accessible>
        <Image
          {...accessibility(
            {
              label: 'Error',
              role: 'image'
            },
            { accessible: true }
          )}
          style={styles.image}
          source={require('../../assets/images/error.png')}
        />
      </View>
      <View
        {...accessibility(
          {
            label: 'Error. Pensábamos que te habías ido. Inicia sesión de nuevo'
          },
          { accessible: true, autoFocus: true }
        )}>
        <Text style={styles.title}>Ops!</Text>
        <Text style={styles.description}>
          Pensábamos que te habías ido. Inicia sesión de nuevo.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          {...accessibility(
            {
              label: 'Ok',
              hint: 'Ir a ventana de bienvenida',
              role: 'button'
            },
            { accessible: true }
          )}
          text='OK'
          variant='secondary'
          onPress={() => {
            setIsTokenExpired(false);
          }}
        />
      </View>
    </View>
  );
};

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      flex: 1,
      paddingHorizontal: 16
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
    },
    actions: {
      flex: 1,
      marginBottom: 32,
      paddingHorizontal: 16,
      justifyContent: 'flex-end'
    }
  });

export { TokenExpired };
