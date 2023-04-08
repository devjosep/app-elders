import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';

import { BuildStyles, useTheme } from '../utils';

type ResumeCharactersProps = {
  text?: string;
  maxLength: number;
};

const ResumeCharacters = ({ text = '', maxLength }: ResumeCharactersProps) => {
  const { accessibility } = useAccessibilityAutoFocus();

  const { constants } = useTheme();
  const styles = buildStyles({ constants });

  return (
    <Text
      {...accessibility(
        {
          label: `${text.length} ${
            text.length === 1 ? 'caracter' : 'caracteres'
          } de ${maxLength}`
        },
        { accessible: true }
      )}
      style={styles.text}>{`${text.length} ${
      text.length === 1 ? 'caracter' : 'caracteres'
    } de ${maxLength}`}</Text>
  );
};

export { ResumeCharacters };

const buildStyles = ({
  constants: { FF, FS }
}: Pick<BuildStyles, 'constants'>) =>
  StyleSheet.create({
    text: {
      alignSelf: 'flex-end',
      fontFamily: FF.regular,
      letterSpacing: 0.3,
      paddingHorizontal: 8,
      fontSize: FS.S,
      marginTop: 5
    }
  });
