import React, { useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import { makeCall } from 'utils';

import { useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from '../routes';
import { useWizardStatus } from '../Wizard/stores/wizardStore';

const OtherService = () => {
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });
  const user = useAuth((state) => state.user);
  const reset = useWizardStatus((state) => state.reset);
  const { accessibility } = useAccessibilityAutoFocus();

  const navigation =
    useNavigation<StackNavigationProp<RouteParams, 'OtherService'>>();

  useEffect(() => {
    reset();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.contentWrapper}>
        <Text
          {...accessibility(
            {
              label: `${user.name}, ¿necesitas otro tipo de ayuda?`,
              role: 'text'
            },
            { accessible: true, autoFocus: true }
          )}
          style={styles.title}
        >
          {user.name}, ¿necesitas otro tipo de ayuda?
        </Text>
        <Text
          {...accessibility(
            {
              label:
                'Puedes llamar a Voluntarios por Madrid para explicar qué necesitas exactamente.',
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.subtitle}
        >
          Puedes llamar a Voluntari@s por Madrid para explicar qué necesitas
          exactamente.
        </Text>
        <Button
          {...accessibility(
            {
              label: 'Llamar al 900 777 888',
              role: 'button'
            },
            { accessible: true }
          )}
          text='Llamar al 900 777 888'
          // onPress={() => makeCall('900 777 888')}
          onPress={() => {}}
        />
        <View style={styles.divider} />
        <Button
          {...accessibility(
            {
              label: 'Volver al inicio',
              hint: 'Ir a inicio',
              role: 'button'
            },
            { accessible: true }
          )}
          text='Volver al inicio'
          variant='secondary'
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </ScrollView>
  );
};

export default OtherService;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bgSecondary },
    contentContainer: { paddingBottom: 44 },
    contentWrapper: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 24,
      paddingHorizontal: 30
    },
    title: {
      color: theme.fontColorBase,
      fontFamily: FF.bold,
      fontSize: FS.XXL,
      lineHeight: 55
    },
    subtitle: {
      color: theme.fontColorBase,
      lineHeight: 30,
      fontFamily: FF.regular,
      fontSize: FS.L,
      paddingBottom: 42,
      marginTop: 10
    },
    divider: {
      backgroundColor: theme.divider,
      height: 2,
      marginBottom: 36,
      marginTop: 36,
      alignSelf: 'stretch'
    }
  });
