import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme, BuildStyles } from '@client/ui-components/src/utils';
import { useAccessibilityAutoFocus } from '@client/common';

import { WizardStep } from './WizardSteps/WizardStep';

type WizardStepsProps = {
  numberOfSteps: number;
  currentStep: number;
};

const WizardSteps = ({ numberOfSteps, currentStep }: WizardStepsProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View
      {...accessibility(
        {
          label: `Paso ${currentStep} de ${numberOfSteps}`,
          role: 'text'
        },
        { accessible: true }
      )}
      style={styles.stepContainer}
    >
      <Text style={styles.title}>Pasos</Text>
      <View
        {...accessibility(
          {},
          {
            accessible: false,
            importantForAccessibility: 'no-hide-descendants',
            accessibilityElementsHidden: true
          }
        )}
      >
        <View style={styles.line} />
        <View style={styles.steps}>
          {[...Array(numberOfSteps)].map((_, index) => (
            <WizardStep
              key={index + 1}
              step={index + 1}
              isCurrentStep={index + 1 === currentStep}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export { WizardSteps };

const buildStyles = ({ role, theme, constants: { FS } }: BuildStyles) =>
  StyleSheet.create({
    stepContainer: {},
    title: {
      fontSize: role === 'elders' ? FS.XM : FS.M,
      letterSpacing: role === 'elders' ? 0.3 : 0,
      lineHeight: role === 'elders' ? 24 : 20,
      paddingBottom: role === 'elders' ? 16 : 12,
      textAlign: 'center',
      color: theme.fontColorBase
    },
    steps: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 24
    },
    line: {
      position: 'absolute',
      top: 24,
      width: '100%',
      borderWidth: 1,
      backgroundColor: theme.fontColorBase,
      zIndex: -1
    }
  });
