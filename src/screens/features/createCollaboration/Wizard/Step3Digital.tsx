import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  getCurrentDatePlusHours,
  getCurrentDatePlusMonths,
  navigate,
  useAccessibilityAutoFocus
} from '@client/common';
import {
  CalendarPicker,
  TimePicker
} from '@client/ui-components/src/components';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { WizardStepProps } from '../domain';
import { Actions } from '../shared/Actions';
import { WizardSteps } from '../../createCollaboration/shared/WizardSteps';
import { useWizardStatus } from './stores/wizardStore';

enum DatePickerModes {
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime'
}

const DateTimeSelectionDigital = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const CURRENT_DATE = getCurrentDatePlusHours(49);

  const [adviceShow, setShowAdviceShow] = useState(true);
  const [timeMode, setTimeMode] = useState<DatePickerModes>(
    DatePickerModes.DATE
  );
  const dateRef = useRef<Date>(CURRENT_DATE);

  const { activity, setDate } = useWizardStatus();

  const { theme, role, constants } = useTheme();

  const styles = buildStyles({ role, theme, constants });

  const onChangeDate = (date?: Date) => {
    const dateSelected = date ?? CURRENT_DATE;
    dateRef.current = dateSelected;
    setDate(dateSelected);
    setTimeMode(DatePickerModes.TIME);
  };

  const goNext  = () =>{

  }
  const goPrevious = () => {
    let path = `ChooseQuarter`; 
    navigate(path);
  } 
  const onChangeTime = (date?: Date) => {
    const dateSelected = date ?? CURRENT_DATE;
    dateRef.current = dateSelected;
    setDate(dateSelected);
    setShowAdviceShow(true);
    setTimeMode(DatePickerModes.DATE);
    goNext?.();
  };

  useEffect(() => {
    setDate(CURRENT_DATE);
  }, []);

  return (
    <View style={styles.contentWrapper}>
      <View style={styles.steps}>
        <Text
          {...accessibility(
            { label: activity?.name, role: 'text' },
            { accessible: true }
          )}
          style={styles.title}
        >
          {"ACOMPAÑAMIENTO DIGITAL"}
        </Text>
        <WizardSteps currentStep={1} numberOfSteps={3} />
      </View>
      <View style={styles.content}>
        {adviceShow ? (
          <View
            {...accessibility(
              {
                label:
                  'Cuando pulses “Continuar” aparecerá un calendario para indicar la fecha, y después un reloj para indicar la hora del acompañamiento.',
                role: 'text'
              },
              { accessible: true }
            )}
            style={styles.advice}
          >
            <Text style={styles.advice_text}>
              Cuando pulses “Continuar” aparecerá un calendario para indicar la
              fecha, y después un reloj para indicar la hora del acompañamiento.
              recordamos   que hay que hacer esta peticion con 72 horas de antelacion
            </Text>
          </View>
        ) : timeMode === 'date' ? (
          <CalendarPicker
            date={dateRef.current}
            minDate={getCurrentDatePlusHours(73)}
            maxDate={getCurrentDatePlusMonths(6)}
            onChange={onChangeDate}
            onDismiss={() => {
              setShowAdviceShow(true);
              setTimeMode(DatePickerModes.DATE);
            }}
          />
        ) : (
          <TimePicker
            date={dateRef.current}
            onChange={onChangeTime}
            onDismiss={() => {
              setTimeMode(DatePickerModes.DATE);
            }}
          />
        )}
      </View>
      <View style={styles.actions}>
        <Actions
          backButtonAction={() => goPrevious?.()}
          nextButtonAction={() => {
            setShowAdviceShow(false);
          }}
        />
      </View>
    </View>
  );
};

export default DateTimeSelectionDigital;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    contentWrapper: {
      flex: 1,
      backgroundColor: theme.bgSecondary
    },
    steps: {
      flex: 0.2
    },
    content: {
      flex: 0.65,
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
      paddingBottom: 8
    },
    actions: {
      flex: 0.15,
      paddingHorizontal: 16,
      paddingBottom: 32,
      justifyContent: 'flex-end'
    },
    dateTimePicker: {
      flex: 1
    },
    title: {
      color: theme.fontColorBase,
      fontFamily: FF.bold,
      fontSize: 25,
      lineHeight: 38,
      marginBottom: 16,
      paddingHorizontal: 60,
      textAlign: 'center'
    },
    advice: {
      borderRadius: 24,
      backgroundColor: theme.bgAccent,
      paddingHorizontal: 24,
      paddingVertical: 24
    },
    advice_text: {
      fontFamily: FF.semiBold,
      fontSize: FS.XM,
      lineHeight: 24,
      letterSpacing: 0.3,
      color: theme.fontColorNegative
    },
    errorWrapper: {
      paddingTop: 4
    },
    error: {
      color: theme.error,
      fontFamily: FF.regular,
      fontSize: FF.S,
      paddingHorizontal: 8
    }
  });
