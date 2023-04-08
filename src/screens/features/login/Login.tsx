import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { LoginForm } from '@client/ui-components/src/components/LoginForm';
import { BuildStyles, useTheme } from '@client/ui-components/src/utils';

const Login = () => {
  const { theme } = useTheme();
  const styles = buildStyles({ theme });

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
      keyboardShouldPersistTaps='handled'
    >
      <LoginForm />
    </ScrollView>
  );
};

const buildStyles = ({ theme }: Pick<BuildStyles, 'theme'>) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.bgSecondary
    },
    scrollViewContainer: {
      paddingHorizontal: 16
    }
  });

export default Login;
