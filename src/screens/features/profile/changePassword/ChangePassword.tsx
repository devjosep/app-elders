import React from 'react';
import { Alert, StyleSheet } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from 'react-query';

import { useAuth } from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { ChangePasswordFormModel } from '../domain';
import { changePassword as changePasswordService } from '../service';
import { Form } from './ChangePassword/Form';

const ChangePassword = () => {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);

  const {
    mutateAsync: changePassword,
    isError,
    isLoading
  } = useMutation(changePasswordService, {
    onSuccess: () => {
      Alert.alert(
        'Contraseña cambiada correctamente',
        'Por favor, vuelve a iniciar sesión con tu nueva contraseña'
      );
      signOut();
    }
  });

  const { theme, constants, role } = useTheme();

  const styles = buildStyles({ theme, constants, role });

  const onSubmit = async (data: ChangePasswordFormModel) => {
    await changePassword({ ...data, username: user.email });
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.container}
    >
      <Form
        isActionDisabled={isLoading}
        isError={isError}
        onSubmit={onSubmit}
      />
    </KeyboardAwareScrollView>
  );
};

export { ChangePassword };

const buildStyles = ({ theme }: BuildStyles) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.bgSecondary
    }
  });
