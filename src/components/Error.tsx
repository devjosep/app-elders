import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { FallbackProps } from 'react-error-boundary';
import { useQueryErrorResetBoundary, useQueryClient } from 'react-query';

// import { log, useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

type ErrorProps = FallbackProps;

const Error = (error: ErrorProps) => {
  // const { accessibility } = useAccessibilityAutoFocus();
  const navigation = useNavigation();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });
  const { reset } = useQueryErrorResetBoundary();
  // const { email } = useAuth((s) => s.user);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.removeQueries('collaborations', {
      active: false
    });
  }, []);

  // useEffect(() => {
  //   if (error) {
  //     log({
  //       message: `[${new Date()}] | user (${email}) | error: ${JSON.stringify(
  //         error
  //       )}`
  //     });
  //   }
  // }, [error]);

  return (
    <View style={styles.container}>
      <Image
        // {...accessibility(
        //   { role: 'none' },
        //   {
        //     accessible: false,
        //     accessibilityElementsHidden: true,
        //     importantForAccessibility: 'no-hide-descendants'
        //   }
        // )}
        source={require('../../assets/images/error.png')}
        style={styles.image}
      />
      <View
        // {...accessibility(
        //   {
        //     label:
        //       'Lo sentimos. Se ha producido un error inesperado. Inténtalo de nuevo más tarde.'
        //   },
        //   { accessible: true, autoFocus: true }
        // )}
      >
        <Text style={styles.title}>Lo sentimos...</Text>
        <Text style={styles.description}>
          Se ha producido un error inesperado. Inténtalo de nuevo más tarde.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          // {...accessibility(
          //   {
          //     label: 'Volver a inicio',
          //     hint: 'Ir a ventana de inicio',
          //     role: 'button'
          //   },
          //   { accessible: true }
          // )}
          text='Volver a Inicio'
          variant='secondary'
          onPress={async () => {
            reset();
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: 'Home' }]
              })
            );
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

export { Error };
