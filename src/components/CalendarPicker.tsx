import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import {
  Calendar as NativeCalendar,
  LocaleConfig
} from 'react-native-calendars';
import Modal from 'react-native-modal';
import { BuildStyles } from 'src/utils/types';

import { useAccessibilityAutoFocus } from '@client/common';
import { dateToString } from '@client/common/src/utils/dates';

import { useTheme } from '../utils/useTheme';
import { Button } from './Button';
import { CalendarHeader } from './calendar/CalendarHeader';
import { CustomBackdropModal } from './CustomBackdropModal';

type CalendarPickerProps = {
  date: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date?: Date) => void;
  onDismiss?: () => void;
};

const CalendarPicker = ({
  date,
  minDate,
  maxDate,
  onChange,
  onDismiss
}: CalendarPickerProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const [selectedDay, setSelectedDay] = useState<Date>(date);

  const { theme, constants, role } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const onChangeDate = () => {
    const newDate = new Date(date);
    newDate.setFullYear(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate()
    );
    onChange?.(newDate);
  };

  return (
    <Modal
      style={styles.modal}
      accessibilityViewIsModal
      isVisible
      useNativeDriver
      customBackdrop={<CustomBackdropModal />}>
      <View style={styles.modalContent}>
        <NativeCalendar
          style={styles.calendar}
          current={date as any}
          monthFormat='MMMM yyyy'
          enableSwipeMonths
          hideExtraDays
          disableAllTouchEventsForDisabledDays
          customHeader={CalendarHeader}
          theme={
            {
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: theme.fontColorBase,
              todayTextColor: theme.fontColorBase,
              dayTextColor: theme.fontColorBase,
              textDisabledColor: theme.fontColorDisabled,
              textDayFontFamily: constants.FF.regular,
              textDayFontSize: constants.FS.L,
              textDayStyle: styles.textDay,
              'stylesheet.calendar.main': {
                emptyDayContainer: {
                  flex: 1
                },
                dayContainer: {
                  flex: 1,
                  alignItems: 'center'
                }
              },
              'stylesheet.day.basic': {
                base: {
                  width: 48,
                  height: 48,
                  alignItems: 'center'
                },
                selected: {
                  borderRadius: 24
                }
              }
            } as any
          }
          markedDates={
            selectedDay
              ? {
                  [dateToString(selectedDay, 'yyyy-MM-dd')]: {
                    selected: true,
                    selectedColor: theme.secondary,
                    selectedTextColor: theme.bgSecondary,
                    accessibilityLabel: 'Día seleccionado'
                  }
                }
              : undefined
          }
          firstDay={1}
          minDate={minDate}
          maxDate={maxDate}
          onDayPress={(date) => setSelectedDay(new Date(date.dateString))}
        />
        <View style={styles.buttonsContainer}>
          <Button
            {...accessibility(
              {
                label: 'Atrás',
                hint: 'Cancelar la selección de fecha',
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
                hint: 'Aceptar la selección de fecha',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Aceptar'
            variant='primary'
            disabled={!selectedDay}
            style={styles.acceptButton}
            onPress={onChangeDate}
          />
        </View>
      </View>
    </Modal>
  );
};

const buildStyles = ({ theme, constants: { RADIUS } }: BuildStyles) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      width: Dimensions.get('window').width - 50,
      maxWidth: 450,
      borderRadius: RADIUS.L,
      padding: 10,
      backgroundColor: theme.bgSecondary,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10
    },
    calendar: {
      height: 490
    },
    textDay: {
      height: 48,
      width: 48,
      lineHeight: 35,
      alignItems: 'center',
      textAlign: 'center',
      textAlignVertical: 'center'
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

LocaleConfig.locales['es-ES'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sept',
    'oct',
    'nov',
    'dic'
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ],
  dayNamesShort: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  today: 'Hoy',
  formatAccessibilityLabel: "d 'de' MMMM 'de' yyyy dddd"
};
LocaleConfig.defaultLocale = 'es-ES';

export { CalendarPicker };
