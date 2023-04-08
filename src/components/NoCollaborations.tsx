import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { useTheme, BuildStyles } from '@client/ui-components/src/utils';
import { useAccessibilityAutoFocus } from '@client/common';

type NoCollaborationType = 'Running' | 'Closed' | 'Conversation';
type NoCollaborationsProps = {
  status: NoCollaborationType;
};

const MessageMap: Record<NoCollaborationType, string> = {
  Running: 'No tienes peticiones en marcha por el momento',
  Closed: 'No tienes ninguna petición pasada',
  Conversation: 'Todavía no tienes conversaciones abiertas'
};

const NoCollaborations = ({ status = 'Running' }: NoCollaborationsProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { role, theme, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View
      {...accessibility(
        {
          label: MessageMap[status],
          role: 'text'
        },
        { accessible: true }
      )}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/emptyBox.png')} />
      </View>
      <Text style={styles.message}>{MessageMap[status]}</Text>
    </View>
  );
};

export { NoCollaborations };

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center'
    },
    imageContainer: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'center',
      paddingBottom: 8
    },
    message: {
      color: theme.bgTertiary,
      fontFamily: FF.regular,
      fontSize: FS.XM,
      paddingHorizontal: 50,
      textAlign: 'center'
    }
  });
