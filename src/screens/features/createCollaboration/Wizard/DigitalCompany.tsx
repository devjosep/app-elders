import React, { useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeCall } from 'utils';

import { navigate, useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from '../routes';
import { useWizardStatus } from 'stores/wizardStore';


const DigitalCompany = () => {const { theme, role, constants } = useTheme();
const styles = buildStyles({ role, theme, constants });
const user = useAuth((state) => state.user);
const { accessibility } = useAccessibilityAutoFocus();

const navigation =
  useNavigation<StackNavigationProp<RouteParams, 'DigitalCompany'>>();

  const routeChange = () =>{ 
    let path = `ChooseDistrict`; 
    navigate(path);
  }

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
        {user.name}, 
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
       Para solicitar este tipo de ayuda necesitamos que primero seleciones tu distrito
      </Text>
      <Button
        {...accessibility(
          {
            label: 'Llamar al 900 777 888',
            role: 'button'
          },
          { accessible: true }
        )}
        text='Selecionar mi distrito'
        onPress={routeChange}
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

export default DigitalCompany;

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
