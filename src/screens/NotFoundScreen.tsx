import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';

import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RootStackParamList } from '../types';

export default function NotFoundScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'NotFound'>) {
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity
        onPress={() => navigation.replace('Home')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const buildStyles = ({ theme, constants: { FS, FF } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: theme.bgSecondary,
      flex: 1,
      justifyContent: 'center',
      padding: 20
    },
    title: {
      fontSize: FS.L,
      fontWeight: FF.bold
    },
    link: {
      marginTop: 15,
      paddingVertical: 15
    },
    linkText: {
      color: '#2e78b7',
      fontSize: FS.S
    }
  });
