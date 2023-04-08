import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { useAccessibilityAutoFocus } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { Input } from '@client/ui-components/src/components/Input';
import { Loading } from '@client/ui-components/src/components/Loading';

import {
  recoveryFormInitialData,
  recoveryFormValidationSchema,
  RecoveryFormModel
} from '../domain';

type FormProps = {
  onSubmit: (data: RecoveryFormModel) => void;
  isLoading: boolean;
};

const Form = ({ onSubmit, isLoading }: FormProps) => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();
  const formMethods = useForm<RecoveryFormModel>({
    resolver: yupResolver(recoveryFormValidationSchema()),
    defaultValues: recoveryFormInitialData
  });

  const { control, handleSubmit, errors } = formMethods;

  const styles = buildStyles();

  useEffect(() => {
    isLoading && announceForAccessibility('Recuperando contraseña');
  }, [isLoading]);

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
    <View style={styles.contentWrapper}>
      <FormProvider {...formMethods}>
        <View style={styles.verticalDivider}>
          <Controller
            control={control}
            render={({ onChange, value }) => (
              <Input
                label='Correo electrónico'
                placeholder='Escribe aquí tu email'
                keyboardType='email-address'
                onChangeText={onChange}
                value={value}
                error={errors?.username?.message}
              />
            )}
            name='username'
          />
        </View>

        <View style={styles.actionsBar}>
          {isLoading ? (
            <Loading style={styles.loading} />
          ) : (
            <Button
              {...accessibility({ label: 'Enviar' }, { accessible: true })}
              text='Enviar'
              onPress={handleSubmit(onSubmit)}
            />
          )}
        </View>
      </FormProvider>
    </View>
  );
};

export { Form };

const buildStyles = () =>
  StyleSheet.create({
    contentWrapper: {
      paddingBottom: 16,
      paddingTop: 24
    },
    actionsBar: {
      marginTop: 10
    },
    verticalDivider: {
      marginBottom: 28
    },
    loading: {
      paddingHorizontal: 16,
      paddingVertical: 12
    }
  });
