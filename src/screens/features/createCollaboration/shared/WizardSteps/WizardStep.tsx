import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

type WizardStepProps = {
  step: number;
  isCurrentStep?: boolean;
};

const WizardStep = ({ step, isCurrentStep = false }: WizardStepProps) => {
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View
      style={[styles.stepItem, isCurrentStep ? styles.isCurrentStep : null]}
    >
      <Text
        style={[styles.stepNumber, isCurrentStep ? styles.isCurrentStep : null]}
      >
        {step}
      </Text>
    </View>
  );
};

export { WizardStep };

const buildStyles = ({
  theme,
  constants: { RADIUS, FF, FS, Z_INDEX }
}: BuildStyles) =>
  StyleSheet.create({
    stepItem: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
      borderRadius: RADIUS.circle,
      borderWidth: 2,
      borderColor: theme.fontColorBase,
      backgroundColor: theme.bgSecondary,
      zIndex: Z_INDEX.overDefault
    },
    stepNumber: {
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: FF.bold,
      fontSize: FS.L,
      lineHeight: 30,
      color: theme.fontColorBase
    },
    isCurrentStep: {
      color: theme.fontColorNegative,
      backgroundColor: theme.bgTertiary
    }
  });
