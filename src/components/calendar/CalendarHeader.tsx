import React, { forwardRef, Ref } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle
} from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common/src/shared/hooks/useAccessibilityAutoFocus';
import { dateToString } from '@client/common/src/utils/dates';

import { BuildStyles, useTheme } from '../../utils';
import ChevronLeft from 'icons/chevronLeft.svg';
import ChevronRight from 'icons/chevronRight.svg';

type CalendarHeaderProps = {
  month: Date;
  disableArrowLeft?: boolean;
  disableArrowRight?: boolean;
  addMonth: (value: number) => void;
};

const CalendarHeader = forwardRef(
  (
    {
      addMonth,
      disableArrowLeft,
      disableArrowRight,
      month
    }: CalendarHeaderProps,
    ref: Ref<View>
  ) => {
    const { accessibility } = useAccessibilityAutoFocus();
    const { theme, role, constants } = useTheme();
    const styles = buildStyles({ role, theme, constants });

    return (
      <View ref={ref}>
        <View style={styles.headerMonth}>
          <TouchableOpacity
            style={styles.arrowContainer}
            onPress={!disableArrowLeft ? () => addMonth(-1) : undefined}
            disabled={disableArrowLeft}
            {...accessibility(
              {
                label: 'Mes anterior',
                hint: 'Ir al mes anterior',
                role: 'button'
              },
              { accessible: true }
            )}>
            <ChevronLeft style={styles.icon as StyleProp<ViewStyle>} />
          </TouchableOpacity>
          <View
            style={styles.monthContainer}
            {...accessibility(
              {
                label: dateToString(new Date(month), 'MMMM yyyy'),
                role: 'text'
              },
              { accessible: true }
            )}>
            <Text lineBreakMode='tail' numberOfLines={1} style={styles.month}>
              {dateToString(new Date(month), 'MMMM')}
            </Text>
            <Text lineBreakMode='tail' numberOfLines={1} style={styles.year}>
              {dateToString(new Date(month), 'yyyy')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.arrowContainer}
            onPress={!disableArrowRight ? () => addMonth(1) : undefined}
            disabled={disableArrowRight}
            {...accessibility(
              {
                label: 'Mes siguiente',
                hint: 'Ir al siguiente mes',
                role: 'button'
              },
              { accessible: true }
            )}>
            <ChevronRight style={styles.icon as StyleProp<ViewStyle>} />
          </TouchableOpacity>
        </View>

        <View
          style={styles.weekDaysContainer}
          accessible={false}
          importantForAccessibility='no-hide-descendants'
          accessibilityElementsHidden>
          <Text style={styles.weekDay}>L</Text>
          <Text style={styles.weekDay}>M</Text>
          <Text style={styles.weekDay}>X</Text>
          <Text style={styles.weekDay}>J</Text>
          <Text style={styles.weekDay}>V</Text>
          <Text style={styles.weekDay}>S</Text>
          <Text style={styles.weekDay}>D</Text>
        </View>
      </View>
    );
  }
);

const buildStyles = ({ theme, constants: { FS, FF } }: BuildStyles) =>
  StyleSheet.create({
    headerMonth: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      maxHeight: 80
    },
    monthContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      maxWidth: 150
    },
    month: {
      fontSize: FS.L,
      fontFamily: FF.bold,
      textTransform: 'capitalize'
    },
    year: {
      fontSize: FS.L,
      fontFamily: FF.regular
    },
    icon: {
      color: theme.secondary,
      padding: 16
    },
    arrowContainer: {
      padding: 10
    },
    weekDaysContainer: {
      marginTop: 7,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    weekDay: {
      textAlign: 'center',
      marginTop: 2,
      marginBottom: 7,
      width: 32
    }
  });

export { CalendarHeader };
