import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';

import CheckIcon from '../../assets/icons/check.svg';
import { useTheme, BuildStyles } from '../utils';

type RadioButtonProps = {
  label: string;
  checked: boolean;
  accessibleText?: string;
  disabled?: boolean;
  onPress?: () => void;
};

const RadioButton = ({
  label,
  accessibleText,
  checked = false,
  disabled = false,
  onPress = () => {}
}: RadioButtonProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const styles = buildStyles({ role, theme, constants });

  return (
    <TouchableOpacity
      {...accessibility(
        {
          label: accessibleText,
          role: 'radio',
          state: { checked }
        },
        { accessible: true }
      )}
      style={[disabled ? styles.isDisabled : {}, isFocused && styles.isFocused]}
      onPress={onPress}
      disabled={false}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}>
      <View style={styles.radioContainer}>
        <View style={[checked && styles.radioChecked, styles.radioCircle]}>
          {checked && <CheckIcon style={styles.radioIcon} />}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export { RadioButton };

const buildStyles = ({
  role,
  theme,
  constants: { RADIUS, FF, FS, OPACITY }
}: BuildStyles) =>
  StyleSheet.create({
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 48
    },
    radioCircle: {
      height: role === 'elders' ? 36 : 24,
      width: role === 'elders' ? 36 : 24,
      borderRadius: RADIUS.circle,
      borderWidth: 2,
      borderColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    radioChecked: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%'
    },
    radioIcon: {
      color: theme.fontColorBase,
      height: role === 'elders' ? 18 : 12,
      width: role === 'elders' ? 18 : 12
    },
    radioLabel: {
      fontSize: role === 'elders' ? FS.XM : FS.M,
      fontFamily: FF.semiBold,
      paddingLeft: role === 'elders' ? 16 : 12,
      letterSpacing: role === 'elders' ? 0.3 : 0
    },
    isDisabled: {
      opacity: OPACITY.disabled
    },
    isFocused: {
      borderColor: theme.bcInputFocus,
      color: theme.fcInputFocus
    }
  });
