import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { Controller, useForm } from 'react-hook-form';
import { BuildStyles } from 'src/utils/types';

import {
  LoginInfo,
  loginValidationSchema,
  useAccessibilityAutoFocus,
  makeCall,
  useAuth
} from '@client/common';

import { useTheme } from '../utils/useTheme';
import { Button } from './Button';
import { Input } from './Input';
import { Loading } from './Loading';

const LoginForm = () => {
  const passwordRef = useRef<TextInput>(null);
  const {
    accessibility,
    announceForAccessibility
  } = useAccessibilityAutoFocus();
  const signIn = useAuth((s) => s.signIn);

  const [authError, setAuthError] = useState('');
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const {
    control,
    errors,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginInfo>({
    mode: 'all',
    resolver: yupResolver(loginValidationSchema()),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (values: LoginInfo) => {
    setAuthError('');
    const { username, password } = values;
    try {
      await signIn(username, password);
    } catch (err) {
      const message =
        (err as Error)?.message || 'Ha ocurrido un error inesperado';
      announceForAccessibility(message);
      setAuthError(message);
    }
  };

  useEffect(() => {
    isSubmitting && announceForAccessibility('Iniciando sesión');
  }, [isSubmitting]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorsMessage = Object.values(errors)
        .map((x) => x?.message ?? '')
        .toString();

      announceForAccessibility(
        `Tienes los siguentes errores. ${errorsMessage}`
      );
    }
  }, [errors]);

  return (
    <>
      <Text
        style={styles.text}
        {...accessibility(
          {
            label:
              'Por favor, inicia sesión con los datos que te ha proporcionado Voluntarios por Madrid:',
            role: 'text'
          },
          { accessible: true }
        )}>
        Por favor, inicia sesión con los datos que te ha proporcionado
        Voluntari@s por Madrid:
      </Text>

      <View style={styles.verticalDivider}>
        <Controller
          name='username'
          control={control}
          render={({ onChange, value }) => (
            <Input
              {...accessibility({}, { autoFocus: true })}
              label='Usuario'
              placeholder='Escribe aquí tu usuario'
              keyboardType='email-address'
              autoCompleteType='username'
              textContentType='username'
              value={value}
              onChangeText={(ev) => {
                onChange(ev);
                setAuthError('');
              }}
              returnKeyType='next'
              onSubmitEditing={() => {
                passwordRef.current?.focus();
              }}
              error={errors?.username?.message}
              autoFocus
            />
          )}
        />
      </View>
      <View style={styles.passwordContainer}>
        <Controller
          name='password'
          control={control}
          render={({ onChange, value }) => (
            <Input
              ref={passwordRef}
              label='Contraseña'
              placeholder='Escribe aquí tu contraseña'
              keyboardType='default'
              secureTextEntry
              autoCompleteType='password'
              textContentType='password'
              value={value}
              onChangeText={(ev) => {
                onChange(ev);
                setAuthError('');
              }}
              returnKeyType='done'
              onSubmitEditing={handleSubmit(onSubmit)}
              error={errors?.password?.message}
            />
          )}
        />
      </View>

      <View
        {...accessibility(
          {
            label: authError,
            role: 'text'
          },
          { accessible: !!authError }
        )}>
        <Text
          {...accessibility({}, { accessible: false })}
          style={styles.error}>
          {authError}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {isSubmitting ? (
          <View style={styles.loader}>
            <Loading />
          </View>
        ) : (
          <Button
            {...accessibility(
              {
                label: 'Iniciar sesión',
                hint: 'Iniciar sesión',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Iniciar sesión'
            variant='primary'
            onPress={handleSubmit(onSubmit)}
          />
        )}
      </View>

      <View style={styles.verticalDivider}>
        <View style={styles.divider} />
        <Text
          {...accessibility(
            {
              label: '¿Necesitas ayuda?',
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.subtitle}>
          ¿Necesitas ayuda?
        </Text>
        <Button
          {...accessibility(
            {
              label: 'Llamar al 900 777 888',
              role: 'button',
              state: { disabled: isSubmitting }
            },
            { accessible: true }
          )}
          variant='secondary'
          disabled={isSubmitting}
          onPress={() => makeCall('900777888')}
          text='Llamar al 900 777 888'
        />
      </View>
    </>
  );
};

const buildStyles = ({ role, theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    verticalDivider: {
      marginBottom: role === 'elders' ? 28 : 20
    },
    passwordContainer: {
      marginBottom: 12
    },
    buttonContainer: {
      marginVertical: 16
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
    text: {
      textAlign: 'center',
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.L,
      lineHeight: 30,
      marginBottom: 16
    },
    divider: {
      height: 2,
      backgroundColor: theme.divider,
      marginBottom: 32,
      marginTop: 32
    },
    subtitle: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.L,
      letterSpacing: 0,
      paddingBottom: 16,
      textAlign: 'center'
    },
    loader: {
      height: 60
    },
    error: {
      color: theme.error,
      fontFamily: FF.regular,
      fontSize: FF.S,
      paddingHorizontal: 8
    }
  });

export { LoginForm };
