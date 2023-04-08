import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from 'react-query';

import { useAccessibilityAutoFocus } from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { ValidationSMSFormModel } from './domain';
import { ValidationSMSForm } from './register/ValidationSMSForm';
import { RouteParams } from './routes';
import { validationSMS } from './service';

const RegisterValidationSMS = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const navigation =
    useNavigation<StackNavigationProp<RouteParams, 'RegisterValidationSMS'>>();

  const {
    params: { token }
  } = useRoute<RouteProp<RouteParams, 'RegisterValidationSMS'>>();

  const { mutateAsync: validate, isLoading } = useMutation<
    void,
    Error,
    ValidationSMSFormModel
  >(validationSMS, {
    onSuccess: () => navigation.navigate('RegisterConfirmation'),
    onError: (error: Error) =>
      navigation.navigate('RegisterError', { message: error.message })
  });

  const onSubmit = (data: ValidationSMSFormModel) =>
    validate({ ...data, token });

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps='handled'
      extraScrollHeight={50}
      contentContainerStyle={styles.container}
      enableOnAndroid
    >
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
        Validación de registro
      </Text>
      <Text
        {...accessibility(
          {
            label:
              'Comprueba tu móvil, recibirás un mensaje de texto con un código de validación. Por favor, introduce el código en el campo situado justo debajo',
            role: 'text'
          },
          { accessible: true }
        )}
        style={styles.description}
      >
        Comprueba tu móvil, recibirás un mensaje de texto con un código de
        validación. Por favor, introduce el código en el campo situado justo
        debajo
      </Text>
      <ValidationSMSForm
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={() => navigation.navigate('Register')}
      />
    </KeyboardAwareScrollView>
  );
};

export default RegisterValidationSMS;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      flexGrow: 1,
      paddingHorizontal: 16
    },
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
      marginBottom: 32
    }
  });
