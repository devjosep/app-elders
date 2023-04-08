import React, { useState } from 'react';

import { CheckBox } from 'react-native-elements';

import { useTheme } from '../utils';

interface CheckboxProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  defaultValue?: boolean;
  onPress?: (checked: boolean) => void;
}

const Checkbox = ({
  accessible,
  accessibilityLabel,
  accessibilityHint,
  defaultValue = false,
  onPress
}: CheckboxProps) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(defaultValue);

  const { theme } = useTheme();

  const handleOnPress = () => {
    setToggleCheckBox(!toggleCheckBox);
    onPress?.(!toggleCheckBox);
  };

  return (
    <CheckBox
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole='checkbox'
      checked={toggleCheckBox}
      size={40}
      checkedColor={theme.bcInputFocus}
      uncheckedColor={theme.bcInputFocus}
      onPress={handleOnPress}
    />
  );
};

export { Checkbox };
