import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';

type ActionsProps = {
  backButtonAction: () => void;
  nextButtonAction: () => void;
  isDisabled?: boolean;
};

const Actions = ({
  backButtonAction,
  nextButtonAction,
  isDisabled = false
}: ActionsProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  return (
    <View style={styles.buttonBar}>
      <View style={[styles.buttonItem, { paddingRight: 10 }]}>
        <Button
          {...accessibility(
            {
              label: 'Anterior',
              hint: 'Ir a paso anterior',
              role: 'button',
              state: { disabled: isDisabled }
            },
            { accessible: true }
          )}
          disabled={isDisabled}
          variant='secondary'
          onPress={backButtonAction}
          text='Anterior'
        />
      </View>
      <View style={styles.buttonItem}>
        <Button
          {...accessibility(
            {
              label: 'Continuar',
              hint: 'Ir a siguiente paso',
              role: 'button',
              state: { disabled: isDisabled }
            },
            { accessible: true }
          )}
          disabled={isDisabled}
          onPress={nextButtonAction}
          text='Continuar'
        />
      </View>
    </View>
  );
};

export { Actions };

const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: 'row'
  },
  buttonItem: {
    flexGrow: 1,
    flexShrink: 1
  }
});
