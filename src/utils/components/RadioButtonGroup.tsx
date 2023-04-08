import React from 'react';
import { View, StyleSheet } from 'react-native';

import { RadioButton } from './RadioButton';

type RadioButtonConfig<T> = {
  label: string;
  value: T;
};

type RadioButtonGroupProps<T> = {
  radioButtons: RadioButtonConfig<T>[];
  onChange: (value: T) => void;
  value: T;
};

const RadioButtonGroup = <T,>({
  radioButtons,
  value,
  onChange
}: RadioButtonGroupProps<T>) => (
  <View style={styles.radioContainer}>
    {radioButtons.map((radioButton) => (
      <RadioButton
        key={`${radioButton.label}-${radioButton.value}`}
        label={radioButton.label}
        onPress={() => onChange(radioButton.value)}
        checked={radioButton.value === value}
      />
    ))}
  </View>
);

export { RadioButtonGroup };

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  }
});
