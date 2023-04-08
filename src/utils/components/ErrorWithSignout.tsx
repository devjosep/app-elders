import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

const ErrorWithSignout = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });
  const signOut = useAuth((u) => u.signOut);
  const setIsFetcherError = useAuth((u) => u.setIsFetcherError);

  useEffect(() => {
    signOut();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        {...accessibility(
          {
            label: 'Error',
            role: 'image'
          },
          { accessible: true }
        )}
        source={require('../../assets/images/error.png')}
        style={styles.image}
      />
      <View
        {...accessibility(
          {
            label:
              'Lo sentimos. Se ha producido un error inesperado. Inténtalo de nuevo más tarde'
          },
          { accessible: true, autoFocus: true }
        )}>
        <Text style={styles.title}>Lo sentimos...</Text>
        <Text style={styles.description}>
          Se ha producido un error inesperado. Inténtalo de nuevo más tarde.
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
            setIsFetcherError(false);
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

export { ErrorWithSignout };
