import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from 'react-query';
import { makeCall } from 'utils';

import { useAccessibilityAutoFocus } from '@client/common';
import { Button } from '@client/ui-components/src/components';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RegisterFormModel, RegisterResponse } from './domain';
import { Form } from './register/Form';
import { RouteParams } from './routes';
import { registerUser } from './service';

const Register = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const navigation =
    useNavigation<StackNavigationProp<RouteParams, 'Register'>>();

  const { mutateAsync: register, isLoading } = useMutation<
    RegisterResponse,
    Error,
    RegisterFormModel
  >(registerUser, {
    onSuccess: ({ token }) =>
      navigation.navigate('RegisterValidationSMS', { token }),
    onError: (error: Error) =>
      navigation.navigate('RegisterError', { message: error.message })
  });

  const onSubmit = (data: RegisterFormModel) => register(data);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      <Text style={styles.title}>
        Por favor introduce la siguiente información:
      </Text>

      <Form isActionDisabled={isLoading} onSubmit={onSubmit} />

      <View style={styles.actions}>
        <View style={styles.divider} />
        <Text
          {...accessibility(
            {
              label: '¿Necesitas ayuda?',
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.subtitle}
        >
          ¿Necesitas ayuda?
        </Text>
        <Button
          {...accessibility(
            {
              label: 'Llamar al 900 777 888',
              role: 'button',
              state: { disabled: isLoading }
            },
            { accessible: true }
          )}
          variant='secondary'
          disabled={isLoading}
          onPress={() => makeCall('900777888')}
          text='Llamar al 900 777 888'
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Register;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      flex: 1
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 40
    },
    title: {
      fontFamily: FF.regular,
      color: theme.fontColorBase,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      lineHeight: 24,
      paddingHorizontal: 8
    },
    actions: {
      alignItems: 'center',
      paddingHorizontal: 16
    },
    subtitle: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.L,
      letterSpacing: 0,
      paddingBottom: 16,
      textAlign: 'center'
    },
    divider: {
      height: 2,
      width: '100%',
      backgroundColor: theme.divider,
      marginBottom: 32,
      marginTop: 32
    }
  });
