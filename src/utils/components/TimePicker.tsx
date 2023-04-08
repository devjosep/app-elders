import React, { useEffect, useRef } from 'react';
import { View, Text, Platform, StyleSheet, TextInput } from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { Controller, useForm } from 'react-hook-form';
import Modal from 'react-native-modal';
import { BuildStyles } from 'src/utils/types';
import * as yup from 'yup';

import {
  dateToDateTimeString,
  useAccessibilityAutoFocus
} from '@client/common';

import { useTheme } from '../utils/useTheme';
import { Button } from './Button';
import { CustomBackdropModal } from './CustomBackdropModal';
import { Input } from './Input';

type TimePickerProps = {
  date: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date?: Date) => void;
  onDismiss?: () => void;
};

type TimePickerForm = {
  hours: number;
  minutes: number;
  date: Date | null;
};

const formValidation = (minDate: Date | undefined) =>
  yup.object<TimePickerForm>().shape({
    hours: yup
      .number()
      .nullable()
      .transform((value) => (value !== '' && !isNaN(value) ? value : undefined))
      .required('La hora es obligatoria')
      .min(0, 'Introduce una hora válida')
      .max(23, 'Introduce una hora válida'),
    minutes: yup
      .number()
      .nullable()
      .transform((value) => (value !== '' && !isNaN(value) ? value : undefined))
      .required('Los minutos son obligatorios')
      .min(0, 'Introduce una hora válida')
      .max(59, 'Introduce una hora válida'),
    date: minDate
      ? yup
          .date()
          .min(
            minDate as Date,
            `La hora tiene que ser superior a ${dateToDateTimeString(
              minDate,
              'HH:mm'
            )}`
          )
      : yup.object().nullable()
  });

const TimePicker = ({
  date,
  minDate,
  onChange,
  onDismiss
}: TimePickerProps) => {
  const {
    accessibility,
    announceForAccessibility
  } = useAccessibilityAutoFocus();
  const { theme, constants, role } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const minutesRef = useRef<TextInput>(null);

  const {
    control,
    errors,
    clearErrors,
    handleSubmit,
    getValues,
    setValue
  } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(formValidation(minDate)),
    defaultValues: {
      hours: date.getHours().toString().padStart(2, '0'),
      minutes: date.getMinutes().toString().padStart(2, '0'),
      date: minDate ?? null
    }
  });

  const onSubmit = ({ hours, minutes }: TimePickerForm) => {
    clearErrors();
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    onChange?.(newDate);
  };

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
    <Modal
      accessibilityViewIsModal
      isVisible
      useNativeDriver
      customBackdrop={<CustomBackdropModal />}>
      <View style={styles.modalContent}>
        <Controller
          name='date'
          defaultValue={null}
          control={control}
          render={() => <Text style={{ opacity: 0, height: 0 }} />}
        />
        <Text style={styles.title}>Establecer hora</Text>
        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <Controller
                name='hours'
                control={control}
                render={({ onChange, value }) => (
                  <Input
                    label='Hora'
                    accessibleLabel={false}
                    placeholder='Hora'
                    keyboardType={
                      Platform.OS === 'android' ? 'numeric' : 'number-pad'
                    }
                    value={value}
                    onChangeText={(hours) => {
                      const newDate = new Date(date);
                      newDate.setHours(+hours, +getValues().minutes, 0, 0);
                      setValue('date', newDate);
                      onChange?.(hours);
                    }}
                    returnKeyType='next'
                    maxLength={2}
                    onSubmitEditing={() => {
                      minutesRef.current?.focus();
                    }}
                  />
                )}
              />
            </View>
            <View style={styles.input}>
              <Controller
                name='minutes'
                control={control}
                render={({ onChange, value }) => (
                  <Input
                    ref={minutesRef}
                    accessibleLabel={false}
                    label='Minutos'
                    placeholder='Minutos'
                    keyboardType={
                      Platform.OS === 'android' ? 'numeric' : 'number-pad'
                    }
                    value={value}
                    onChangeText={(minutes) => {
                      const newDate = new Date(date);
                      newDate.setHours(+getValues().hours, +minutes, 0, 0);
                      setValue('date', newDate);
                      onChange?.(minutes);
                    }}
                    returnKeyType='done'
                    maxLength={2}
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
            </View>
          </View>
          <View
            {...accessibility(
              {
                label: errors?.hours?.message ?? errors?.minutes?.message
              },
              { accessible: Object.keys(errors).length > 0 }
            )}
            style={styles.errorContainer}>
            <Text
              {...accessibility(
                {
                  label: errors?.hours?.message ?? errors?.minutes?.message
                },
                { accessible: Object.keys(errors).length > 0 }
              )}
              style={styles.error}>
              {errors?.hours?.message ??
                errors?.minutes?.message ??
                errors?.date?.message}
            </Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            {...accessibility(
              {
                label: 'Atrás',
                hint: 'Cancelar la selección de la hora',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Atrás'
            variant='secondary'
            style={styles.cancelButton}
            onPress={onDismiss}
          />
          <Button
            {...accessibility(
              {
                label: 'Aceptar',
                hint: 'Aceptar la selección de la hora',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Aceptar'
            variant='primary'
            style={styles.acceptButton}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </Modal>
  );
};

const buildStyles = ({ theme, constants: { FF, FS, RADIUS } }: BuildStyles) =>
  StyleSheet.create({
    modalContent: {
      flexShrink: 1,
      borderRadius: RADIUS.L,
      padding: 24,
      backgroundColor: theme.bgSecondary,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10
    },
    title: {
      color: theme.fontColorBase,
      fontFamily: FF.bold,
      fontSize: FS.L
    },
    contentContainer: {
      paddingVertical: 8
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 8
    },
    input: {
      marginRight: 10,
      minWidth: 110
    },
    errorContainer: {
      marginBottom: 10,
      minHeight: 28
    },
    error: {
      color: theme.error,
      fontFamily: FF.regular,
      fontSize: FF.S
    },
    buttonsContainer: { flexDirection: 'row' },
    cancelButton: {
      flex: 1,
      marginRight: 4
    },
    acceptButton: {
      flex: 1,
      marginLeft: 4
    }
  });

export { TimePicker };
