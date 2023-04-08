import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { useAccessibilityAutoFocus } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { Input } from '@client/ui-components/src/components/Input';
import { Loading } from '@client/ui-components/src/components/Loading';

import {
  ChangePasswordFormModel,
  ChangePasswordFormValidationSchema
} from '../../domain';

type FormProps = {
  onSubmit: (data: ChangePasswordFormModel) => void;
  isActionDisabled: boolean;
  isError: boolean;
};

const Form = ({ onSubmit, isActionDisabled }: FormProps) => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();

  const formMethods = useForm<ChangePasswordFormModel>({
    resolver: yupResolver(ChangePasswordFormValidationSchema()),
    defaultValues: {
      password: '',
      repeatPassword: ''
    }
  });
  const { control, handleSubmit, errors } = formMethods;

  useEffect(() => {
    isActionDisabled && announceForAccessibility('Cambiando contraseña');
  }, [isActionDisabled]);

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
    <FormProvider {...formMethods}>
      <View style={styles.container}>
        <View>
          <View style={styles.verticalDivider}>
            <Controller
              name='password'
              control={control}
              render={({ onChange, value }) => (
                <Input
                  key='password'
                  label='Nueva contraseña'
                  placeholder='Escribe aquí la contraseña'
                  keyboardType='visible-password'
                  onChangeText={onChange}
                  value={value}
                  error={errors?.password?.message}
                />
              )}
            />
          </View>
          <View style={styles.verticalDivider}>
            <Controller
              name='repeatPassword'
              control={control}
              render={({ onChange, value }) => (
                <Input
                  key='repeatPassword'
                  label='Repita contraseña'
                  placeholder='Repite nueva contraseña'
                  keyboardType='visible-password'
                  onChangeText={onChange}
                  value={value}
                  error={errors?.repeatPassword?.message}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.actionsBar}>
          {isActionDisabled ? (
            <Loading />
          ) : (
            <Button
              {...accessibility(
                { label: 'Cambiar contraseña', role: 'button' },
                { accessible: true }
              )}
              text='Cambiar contraseña'
              onPress={handleSubmit(onSubmit)}
            />
          )}
        </View>
      </View>
    </FormProvider>
  );
};

export { Form };

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  actionsBar: {
    marginBottom: 32
  },
  verticalDivider: {
    marginBottom: 28
  }
});
