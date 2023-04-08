import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  log,
  makeCall,
  useAccessibilityAutoFocus,
  useAuth
} from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from './routes';

const RegisterError = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });
  const { email } = useAuth((s) => s.user);

  const navigation =
    useNavigation<StackNavigationProp<RouteParams, 'RegisterError'>>();

  const {
    params: { message }
  } = useRoute<RouteProp<RouteParams, 'RegisterError'>>();

  useEffect(() => {
    if (message) {
      log({ message: `[${new Date()}] | user (${email}) | error: ${message}` });
    }
  }, [message]);

  return (
    <View style={styles.container}>
      <Image
        {...accessibility({ role: 'none' }, { accessible: false })}
        style={styles.image}
        source={require(`../../assets/images/error.png`)}
      />
      <Text
        {...accessibility(
          {
            label: 'Lo sentimos',
            role: 'text'
          },
          { accessible: true }
        )}
        style={styles.title}
      >
        Lo sentimos...
      </Text>
      <Text
        {...accessibility(
          {
            label: message
              ? message
              : 'Se ha producido un error inesperado. Inténtalo de nuevo más tarde.',
            role: 'text'
          },
          { accessible: true }
        )}
        style={styles.description}
      >
        {message
          ? message
          : 'Se ha producido un error inesperado. Inténtalo de nuevo más tarde.'}
      </Text>
      <View style={[styles.actions]}>
        <View style={{ marginBottom: 24 }}>
          <Button
            {...accessibility(
              {
                label: 'Llamar al 900 777 888',
                role: 'text'
              },
              { accessible: true }
            )}
            text='Llamar al 900 777 888'
            onPress={() => makeCall('900777888')}
          />
        </View>
        <Button
          {...accessibility(
            {
              label: 'Salir',
              hint: 'Ir a ventana bienvenida',
              role: 'button'
            },
            { accessible: true }
          )}
          variant='secondary'
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: 'Welcome' }]
              })
            );
          }}
          text='Salir'
        />
      </View>
    </View>
  );
};

export default RegisterError;

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
