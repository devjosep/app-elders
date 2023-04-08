import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';
import { useAccessibilityAutoFocus } from '@client/common';

import { RouteParams } from './routes';

const RecoveryConfirmation = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const navigation =
    useNavigation<StackNavigationProp<RouteParams, 'RecoveryConfirmation'>>();

  return (
    <View style={styles.container}>
      <Image
        {...accessibility({ role: 'none' }, { accessible: false })}
        style={styles.image}
        source={require(`../../assets/images/solicitudEnviada.png`)}
      />
      <Text
        {...accessibility(
          {
            label: 'Datos enviados',
            role: 'text'
          },
          { accessible: true }
        )}
        style={styles.title}
      >
        ¡Datos enviados!
      </Text>
      <Text
        {...accessibility(
          {
            label:
              'Comprueba tu correo electrónico, recibirás tu nueva contraseña para poder acceder a la aplicación.',
            role: 'text'
          },
          { accessible: true }
        )}
        style={styles.description}
      >
        Comprueba tu correo electrónico, recibirás tu nueva contraseña para
        poder acceder a la aplicación.
      </Text>
      <View style={styles.actions}>
        <Button
          {...accessibility(
            {
              label: 'Salir',
              hint: 'Ir a ventana bienvenida',
              role: 'button'
            },
            { accessible: true }
          )}
          text='Salir'
          onPress={() => navigation.navigate('Welcome')}
        />
      </View>
    </View>
  );
};

export default RecoveryConfirmation;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      flex: 1,
      paddingHorizontal: 16
    },
    image: { alignSelf: 'center' },
    title: {
      fontFamily: FF.bold,
      color: theme.fontColorBase,
      fontSize: 25,
      lineHeight: 36,
      paddingHorizontal: 8
    },
    description: {
      marginTop: 18,
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
