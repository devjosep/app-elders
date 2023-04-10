import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// import {
//   useRestrictScreenPixelRatio,
//   useAccessibilityAutoFocus,
//   useDeviceRooted
// } from '@client/common';


// import { Button } from '@client/ui-components/src/components/Button';
// import { Button } from '../../components';
import { useTheme, BuildStyles } from '../../utils'
// '@client/ui-components/src/utils';

import { RouteParams } from './routes';
import { Button } from '@client/ui-components/src/components';

const Welcome = () => {
  // const { accessibility } = useAccessibilityAutoFocus();
  // const isRooted = useDeviceRooted();
  const isRooted = false
  // const navigation =
  //   useNavigation<StackNavigationProp<RouteParams, 'Welcome'>>();
  // useRestrictScreenPixelRatio();

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });
  // const styles = {};

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <View style={styles.imageView}>
        <Image
          // {...accessibility(
          //   { role: 'none' },
          //   {
          //     accessible: false,
          //     accessibilityElementsHidden: true,
          //     importantForAccessibility: 'no-hide-descendants'
          //   }
          // )}
          style={styles.welcomeImage}
          source={require('../../../assets/images/bienvenida.png')}
        />
        <Text
          // {...accessibility(
          //   { label: 'Bienvenido', role: 'text' },
          //   { accessible: true }
          // )}
          style={styles.title}
        >
          ¡Bienvenid@!
        </Text>
      </View>
      {isRooted ? (
        <Text
          // {...accessibility(
          //   {
          //     label: 'Error: El dispositivo no puede estar rooteado',
          //     role: 'text'
          //   },
          //   { accessible: true }
          // )}
          style={[styles.text, styles.error]}
        >
          Error: El dispositivo no puede estar rooteado
        </Text>

      ) : (
        <View style={styles.buttonView}>
          <View style={styles.loginView}>
            <Text
              // {...accessibility({
              //   label: 'Si ya estás registrado',
              //   hint: 'Pulsa el botón iniciar sesión para entrar en la aplicación',
              //   role: 'text'
              // })}
              style={styles.text}
            >
              Si ya estás registrado
            </Text>
            {/* <Button
              // {...accessibility(
              //   {
              //     label: 'Iniciar sesión',
              //     hint: 'Ir a iniciar sesión',
              //     role: 'button'
              //   },
              //   { accessible: true }
              // )}
              text='Iniciar sesión'
              onPress={() => {}}
            /> */}
          </View>
          <View style={styles.divider} />
          <View style={styles.signUpView}>
            <Text
              // {...accessibility({
              //   label:
              //     'Si es la primera vez que utilizas la aplicación, debes registrarte',
              //   hint: 'Pulsa el botón iniciar registro para registrarte',
              //   role: 'text'
              // })}
              style={styles.text}
            >
              Si es la primera vez que utilizas la aplicación, debes
              registrarte.
            </Text>
            {/* <Button
              // {...accessibility({
              //   label: 'Iniciar registro',
              //   hint: 'Ir a registro',
              //   role: 'button'
              // })}
              variant='secondary'
              text='Iniciar registro'
              onPress={() =>{} }
            /> */}
            <Text
              // {...accessibility({
              //   label:
              //     '¿Has olvidado la contraseña? Pulsa aquí para recuperarla',
              //   hint: 'Ir a recuperar contraseña',
              //   role: 'button'
              // })}
              style={styles.recovery}
              onPress={() => { }}
            >
              ¿Has olvidado la contraseña?, pulsa{' '}
              <Text style={styles.recovery2}>aquí</Text> para recuperarla
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Welcome;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.bgSecondary
    },
    scrollViewContainer: {
      backgroundColor: theme.bgSecondary,
      paddingHorizontal: 16
    },
    imageView: {},
    error: {},
    welcomeImage: {
      width: 350,
      alignSelf: 'center'
    },
    title: {
      color: theme.fontColorBase,
      fontFamily: FF.bold,
      fontSize: FS.XXL,
      letterSpacing: 0,
      lineHeight: 55,
      textAlign: 'center',
      marginTop: 10
    },
    buttonView: {},
    loginView: {
      justifyContent: 'flex-start',
      marginTop: 20
    },
    signUpView: {
      justifyContent: 'flex-start',
      marginTop: 20
    },
    text: {
      textAlign: 'center',
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.L,
      lineHeight: 30,
      marginBottom: 16
    },
    recovery: {
      textAlign: 'center',
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.M,
      marginTop: 18
    },
    recovery2: {
      color: theme.fontColorAccent
    },
    divider: {
      backgroundColor: theme.divider,
      height: 2,
      marginTop: 30
    }
  });
