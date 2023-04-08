import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Loading } from '@client/ui-components/src/components';
import { Button } from '@client/ui-components/src/components/Button';
import { Input } from '@client/ui-components/src/components/Input';

import { ProfileFormModel, profileFormValidationSchema } from '../../domain';

type FormProps = {
  onSubmit: (data: ProfileFormModel) => void;
  isActionDisabled: boolean;
  isError: boolean;
};

const Form = ({ onSubmit, isActionDisabled }: FormProps) => {
  const user = useAuth((state) => state.user);
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();

  const formMethods = useForm<ProfileFormModel>({
    resolver: yupResolver(profileFormValidationSchema()),
    defaultValues: { name: user.name, phone: user.phone }
  });
  const { control, handleSubmit, errors } = formMethods;

  useEffect(() => {
    isActionDisabled && announceForAccessibility('Modificando datos');
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
              control={control}
              render={({ onChange, value }) => (
                <Input
                  label='Nombre'
                  placeholder='Escribe aquí tu nombre...'
                  key='name'
                  onChangeText={onChange}
                  value={value}
                  error={errors?.name?.message}
                />
              )}
              name='name'
            />
          </View>

          <View style={styles.verticalDivider}>
            <Controller
              control={control}
              render={({ onChange, value }) => (
                <Input
                  label='Teléfono'
                  placeholder='Escribe aquí tu número...'
                  key='phone'
                  keyboardType='numeric'
                  onChangeText={onChange}
                  value={value}
                  error={errors?.phone?.message}
                />
              )}
              name='phone'
            />
          </View>
        </View>
        <View style={styles.actionsBar}>
          {isActionDisabled ? (
            <Loading />
          ) : (
            <Button
              {...accessibility(
                { label: 'Guardar cambios', hint: 'Modificar datos de perfil' },
                { accessible: true }
              )}
              onPress={handleSubmit(onSubmit)}
              text='Guardar cambios'
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
