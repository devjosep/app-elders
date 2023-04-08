import React, { PropsWithChildren } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import { Picker } from '@react-native-picker/picker';

import IconOpened from '../../assets/icons/chevronDown.svg';
import { useTheme, BuildStyles } from '../utils';

type SelectProps = {
  label?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  value?: any;
  onChange?: any;
  testID?: string;
  mode?: string;
  prompt?: string;
};

const Select = ({
  label,
  onChange,
  value,
  accessibilityLabel,
  disabled = false,
  children
}: PropsWithChildren<SelectProps>) => {
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <View>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          <Picker
            accessible
            accessibilityLabel={value}
            accessibilityRole='none'
            enabled={!disabled}
            selectedValue={value}
            onValueChange={onChange}>
            {children}
          </Picker>
        </View>
      ) : (
        <>
          {label ? (
            <Text
              accessible
              accessibilityLabel={accessibilityLabel}
              style={styles.label}>
              {label}
            </Text>
          ) : null}
          <View style={[styles.select, disabled ? styles.isDisabled : null]}>
            <Picker
              enabled={!disabled}
              style={styles.picker}
              selectedValue={value}
              onValueChange={onChange}>
              {children}
            </Picker>
            <View style={styles.pickerIcon}>
              <IconOpened width={20} height={20} />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export { Select };

const buildStyles = ({
  role,
  theme,
  constants: { RADIUS, FF, FS, OPACITY }
}: BuildStyles) =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    label: {
      fontFamily: FF.regular,
      letterSpacing: 0.3,
      paddingHorizontal: 8,
      fontSize: role === 'elders' ? FS.XM : FS.M,
      marginBottom: role === 'elders' ? 8 : 12
    },
    select: {
      backgroundColor: theme.bgDefault,
      borderColor: theme.fontColorBase,
      borderRadius: RADIUS.XS,
      borderWidth: 2,
      flexDirection: 'row',
      overflow: 'hidden',
      paddingHorizontal: 16,
      position: 'relative'
    },
    picker: {
      backgroundColor: 'transparent',
      flex: 1,
      fontSize: role === 'elders' ? FS.XM : FS.M,
      height: 52,
      textDecorationLine: 'none',
      zIndex: 1
    },
    pickerIcon: {
      alignItems: 'center',
      backgroundColor: theme.bgSecondary,
      height: 52,
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
      top: 0,
      width: 52,
      borderLeftWidth: 2,
      borderLeftColor: theme.fontColorBase
    },
    isDisabled: {
      opacity: OPACITY.disabled
    }
  });
