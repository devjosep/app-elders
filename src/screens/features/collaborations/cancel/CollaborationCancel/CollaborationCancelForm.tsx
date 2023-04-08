import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';

import { useAccessibilityAutoFocus } from '@client/common';
import {
  Checkbox,
  ResumeCharacters
} from '@client/ui-components/src/components';
import { Button } from '@client/ui-components/src/components/Button';
import { TextArea } from '@client/ui-components/src/components/TextArea';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import {
  CancelService,
  cancelServiceValidationSchema,
  cancelFormInitialData
} from '../domain';

type CollaborationCancelFormProps = {
  onSubmit: (data: CancelService) => void;
  isActionDisabled: boolean;
  isError: boolean;
};

const CollaborationCancelForm = ({
  onSubmit,
  isActionDisabled
}: CollaborationCancelFormProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const formMethods = useForm<CancelService>({
    mode: 'all',
    resolver: yupResolver(cancelServiceValidationSchema()),
    defaultValues: cancelFormInitialData
  });

  const {
    control,
    handleSubmit,
    errors,
    setValue,
    clearErrors,
    formState: { isValid }
  } = formMethods;

  const isDisabled = isActionDisabled || !isValid;

  const noComment = useWatch<boolean>({
    control,
    name: 'noComment'
  });

  useEffect(() => {
    if (noComment) {
      setValue('message', '');
      clearErrors('message');
    }
  }, [noComment]);

  return (
    <View style={styles.contentWrapper}>
      <FormProvider {...formMethods}>
        <View style={styles.cancelTextArea}>
          <View style={styles.messageTextArea}>
            <Controller
              name='message'
              control={control}
              render={({ value, onChange }) => (
                <>
                  <TextArea
                    placeholder='Escribe aquí el motivo'
                    onChangeText={onChange}
                    value={value}
                    lines={6}
                    maxLength={500}
                    disabled={noComment}
                    error={errors?.message?.message}
                  />
                  <ResumeCharacters text={value} maxLength={500} />
                </>
              )}
            />
          </View>
          <View style={styles.cancelCheck}>
            <View style={styles.cancelCheckbox}>
              <Controller
                name='noComment'
                control={control}
                render={({ onChange, value }) => (
                  <Checkbox
                    {...accessibility(
                      {
                        label: 'Prefiero no indicar el motivo'
                      },
                      { accessible: true }
                    )}
                    defaultValue={value}
                    onPress={onChange}
                  />
                )}
              />
            </View>
            <Text
              {...accessibility(
                {},
                {
                  accessible: false,
                  accessibilityElementsHidden: true,
                  importantForAccessibility: 'no-hide-descendants'
                }
              )}
              style={styles.cancelTextCheck}
            >
              Prefiero no indicar el motivo
            </Text>
          </View>
        </View>
        <View style={styles.buttonBar}>
          <Button
            {...accessibility(
              {
                label: 'Continuar',
                hint: isDisabled
                  ? 'Cancelar petición. Por favor, indica un motivo o seleccina que no prefieres indicar el motivo.'
                  : 'Cancelar petición',

                role: 'button',
                state: { disabled: isDisabled }
              },
              { accessible: true }
            )}
            disabled={isDisabled}
            variant='primary'
            text='CONTINUAR'
            onPress={() => isValid && handleSubmit(onSubmit)()}
          />
        </View>
      </FormProvider>
    </View>
  );
};

export { CollaborationCancelForm };

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    contentWrapper: {
      flex: 1,
      paddingBottom: 16,
      paddingTop: 24
    },
    cancelTextArea: {
      flex: 0.75
    },
    messageTextArea: {
      flex: 0.6
    },
    cancelCheck: {
      flex: 0.4,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      marginTop: 16
    },
    cancelCheckbox: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    cancelTextCheck: {
      flex: 1,
      color: theme.fontColorBase,
      fontFamily: FF.semiBold,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      marginTop: 20
    },
    buttonBar: {
      flex: 0.25,
      justifyContent: 'flex-end'
    }
  });
