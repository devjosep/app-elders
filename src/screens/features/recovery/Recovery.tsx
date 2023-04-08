import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from 'react-query';
import { makeCall } from 'utils';

import { useAccessibilityAutoFocus } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RecoveryFormModel } from './domain';
import { Form } from './Recovery/Form';
import { recovery } from './service';

const Recovery = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const navigation = useNavigation();

  const { mutateAsync: register, isLoading } = useMutation<
    void,
    Error,
    RecoveryFormModel
  >(recovery, {
    onSuccess: () => navigation.navigate('RecoveryConfirmation')
  });

  const onSubmit = (data: RecoveryFormModel) => register(data);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.container}
      enableOnAndroid
    >
      <Text
        {...accessibility(
          {
            label:
              'Por favor introduce el email asociado a tu cuenta y te enviaremos una nueva contraseña:',
            role: 'text'
          },
          { accessible: true }
        )}
        style={styles.title}
      >
        Por favor introduce el email asociado a tu cuenta y te enviaremos una
        nueva contraseña
      </Text>
      <Form isLoading={isLoading} onSubmit={onSubmit} />
      <View style={styles.actions}>
        <View style={styles.divider} />
        <Text
          {...accessibility(
            {
              label: '¿Necesitas ayuda?',
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.subtitle}
        >
          ¿Necesitas ayuda?
        </Text>
        <Button
          {...accessibility(
            {
              label: 'Llamar al 900 777 888',
              role: 'button',
              state: { disabled: isLoading }
            },
            { accessible: true }
          )}
          text='Llamar al 900 777 888'
          variant='secondary'
          disabled={isLoading}
          onPress={() => makeCall('900777888')}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Recovery;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      flexGrow: 1,
      paddingHorizontal: 16
    },
    title: {
      fontFamily: FF.regular,
      color: theme.fontColorBase,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      lineHeight: 24,
      paddingHorizontal: 8
    },
    actions: {
      paddingHorizontal: 16
    },
    subtitle: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.L,
      letterSpacing: 0,
      paddingBottom: 16,
      textAlign: 'center'
    },
    divider: {
      height: 2,
      width: '100%',
      backgroundColor: theme.divider,
      marginBottom: 32,
      marginTop: 32
    }
  });
