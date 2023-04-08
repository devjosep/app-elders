import React, { forwardRef, Ref, useState } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  AccessibilityState
} from 'react-native';

import { getRgbaStrFromHexColor } from '../theme/colors';
import { useTheme } from '../utils';

type Variants = 'primary' | 'secondary' | 'negative' | 'secondary-modal';

type Order = 'left' | 'right';

type ButtonProps = {
  text: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
  variant?: Variants;
  children?: any;
  order?: Order;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const Button = forwardRef(
  (
    {
      text,
      children,
      accessibilityLabel,
      accessibilityHint,
      accessibilityState,
      variant = 'primary',
      order = 'right',
      disabled = false,
      style,
      onPress = () => {}
    }: ButtonProps,
    ref: Ref<TouchableWithoutFeedback>
  ) => {
    const { theme, role, constants } = useTheme();
    const styles = buildStyles({ role, theme, variant, constants, disabled });
    const [, setIsFocused] = useState(false);

    return (
      <TouchableWithoutFeedback
        ref={ref}
        style={styles.container}
        onPress={onPress}
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={accessibilityState}
        accessibilityRole='button'
        disabled={false}
        onPressIn={() => setIsFocused(true)}
        onPressOut={() => setIsFocused(false)}>
        <View
          style={[
            style,
            styles.button,
            variant === 'secondary' ? styles.secondary : {},
            variant === 'secondary-modal' ? styles.secondaryModal : {},
            variant === 'negative' ? styles.negative : {},
            order === 'left' ? styles.left : {}
          ]}>
          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={[
              styles.text,
              variant === 'secondary-modal' ? styles.secondaryModalText : {}
            ]}>
            {text}
          </Text>
          {children}
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

export { Button };

const buildStyles = ({
  role,
  theme,
  variant,
  disabled,
  constants: { RADIUS, FF, FS, OPACITY }
}: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row'
    },
    button: {
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: disabled
        ? getRgbaStrFromHexColor(theme.bgBtnPrimary, OPACITY.disabled)
        : theme.bgBtnPrimary,
      borderColor: disabled
        ? getRgbaStrFromHexColor(theme.bgBtnPrimary, OPACITY.disabled)
        : theme.bgBtnPrimary,
      borderRadius: RADIUS.S,
      borderWidth: 2,
      flexDirection: 'row',
      justifyContent: 'center',
      maxHeight: role === 'elders' ? 60 : 50,
      minHeight: role === 'elders' ? 60 : 50,
      paddingHorizontal: 16,
      paddingVertical: 12
    },
    secondary: {
      backgroundColor: 'transparent'
    },
    secondaryModal: {
      backgroundColor: 'transparent',
      borderColor: theme.fontColorNegative
    },
    secondaryModalText: {
      color: theme.fontColorNegative
    },
    text: {
      alignItems: 'center',
      color: disabled
        ? theme.fontColorBase
        : variant === 'primary'
        ? theme.fontColorNegative
        : theme.fontColorBase,
      fontFamily: FF.medium,
      fontSize: role === 'elders' ? FS.M : FS.M,
      letterSpacing: role === 'elders' ? 0.3 : 0,
      lineHeight: role === 'elders' ? 30 : 24,
      paddingHorizontal: role === 'elders' ? 8 : 4,
      textAlign: 'center'
    },
    left: {
      flexDirection: 'row-reverse'
    },
    negative: {
      backgroundColor: theme.bgBtnNegative,
      borderColor: theme.bgBtnNegative
    },
    isFocused: {
      backgroundColor:
        variant === 'primary'
          ? theme.bgBtnPrimary
          : variant === 'negative'
          ? theme.bgBtnNegative
          : theme.bgBtnSecondFocus,
      borderColor:
        variant === 'negative' ? theme.bgBtnNegative : theme.bgBtnPrimary,
      opacity:
        variant === 'primary' || variant === 'negative' ? OPACITY.push : 1
    }
  });
