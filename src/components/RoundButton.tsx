import React, { PropsWithChildren } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle
} from 'react-native';

import { OPACITY } from '../theme/global';
import { useTheme, BuildStyles } from '../utils';

type RoundButtonProps = {
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  disabled?: boolean;
  marked?: boolean;
  onPress?: () => void;
};

const RoundButton = ({
  style = {},
  marked = false,
  disabled = false,
  accessibilityLabel,
  onPress = () => {},
  children
}: PropsWithChildren<RoundButtonProps>) => {
  const { theme, constants } = useTheme();
  const styles = buildStyles({ theme, constants });

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessible={true}
      onPress={onPress}
      activeOpacity={OPACITY.push}
      disabled={false}>
      <View
        style={[
          styles.button,
          disabled && styles.isDisabled,
          marked && styles.isMarked,
          style
        ]}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export { RoundButton };

const buildStyles = ({
  theme,
  constants: { RADIUS, OPACITY }
}: Pick<BuildStyles, 'constants' | 'theme'>) =>
  StyleSheet.create({
    button: {
      height: 48,
      width: 48,
      borderRadius: RADIUS.circle,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      backgroundColor: theme.bgBtnPrimary
    },
    isMarked: {
      backgroundColor: theme.cAlert
    },
    isDisabled: {
      opacity: OPACITY.disabled
    }
  });
