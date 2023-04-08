import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { BuildStyles, useTheme } from '../utils';

type BubbleProps = {
  label: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  content?: string;
  onPress: () => void;
};

const Bubble = ({
  label,
  accessibilityLabel,
  accessibilityHint,
  content,
  onPress
}: BubbleProps) => {
  const { theme, constants } = useTheme();

  const styles = buildStyles({ theme, constants });

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole='button'
      activeOpacity={0.75}
      onPress={onPress}>
      <View style={styles.bubbleContainer}>
        <Text style={styles.bubbleText}>{`${label}:`}</Text>
        <Text style={[styles.bubbleText, styles.bubbleTextAccent]}>
          {content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const buildStyles = ({
  theme,
  constants: { FS, FF, RADIUS }
}: Pick<BuildStyles, 'constants' | 'theme'>) =>
  StyleSheet.create({
    bubbleContainer: {
      alignItems: 'center',
      borderColor: theme.bcBubble,
      borderRadius: RADIUS.L,
      borderWidth: 2,
      flexDirection: 'row',
      height: 48,
      justifyContent: 'center',
      paddingHorizontal: 16,
      marginBottom: 18,
      marginRight: 16,
      textAlignVertical: 'center'
    },
    bubbleText: {
      color: theme.fontColorBase,
      fontFamily: FF.medium,
      fontSize: FS.S,
      lineHeight: 22
    },
    bubbleTextAccent: {
      color: theme.fontColorAccent,
      fontSize: FS.S,
      marginLeft: 12
    }
  });

export { Bubble };
