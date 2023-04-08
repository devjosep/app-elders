import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { useAccessibilityAutoFocus } from '@client/common';
import { Loading } from '@client/ui-components/src/components';
import { Button } from '@client/ui-components/src/components/Button';
import { Input } from '@client/ui-components/src/components/Input';

import {
  validationSMSFormInitialData,
  ValidationSMSFormModel,
  validationSMSFormValidationSchema
} from '../domain';

type ValidationSMSFormProps = {
  onSubmit: (data: ValidationSMSFormModel) => void;
  onCancel: () => void;
  isLoading: boolean;
};

const ValidationSMSForm = ({
  onSubmit,
  onCancel,
  isLoading
}: ValidationSMSFormProps) => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();
  const formMethods = useForm<ValidationSMSFormModel>({
    resolver: yupResolver(validationSMSFormValidationSchema()),
    defaultValues: validationSMSFormInitialData
  });

  const { control, handleSubmit, errors } = formMethods;

  const styles = buildStyles();

  useEffect(() => {
    isLoading && announceForAccessibility('Validando código');
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
        <View>
          <Controller
            control={control}
            render={({ onChange, value }) => (
              <Input
                label='Código de validación'
                placeholder='Escribe aquí el código'
                keyboardType='default'
                onChangeText={onChange}
                value={value}
                error={errors?.code?.message}
              />
            )}
            name='code'
          />
        </View>

        <View style={styles.actionsBar}>
          {isLoading ? (
            <Loading style={styles.loading} />
          ) : (
            <>
              <Button
                {...accessibility(
                  { label: 'Validar código' },
                  { accessible: true }
                )}
                text='Validar código'
                onPress={handleSubmit(onSubmit)}
              />
              <Button
                style={styles.button}
                {...accessibility(
                  {
                    label: 'Volver a registro',
                    hint: 'Ir a la ventana de registro',
                    role: 'button'
                  },
                  { accessible: true }
                )}
                text='Volver al registro'
                variant='secondary'
                onPress={onCancel}
              />
            </>
          )}
        </View>
      </FormProvider>
    </View>
  );
};

export { ValidationSMSForm };

const buildStyles = () =>
  StyleSheet.create({
    contentWrapper: {
      paddingBottom: 16,
      paddingTop: 24
    },
    actionsBar: {
      marginTop: 32
    },
    loading: {
      paddingHorizontal: 16,
      paddingVertical: 12
    },
    button: {
      marginTop: 18
    }
  });
