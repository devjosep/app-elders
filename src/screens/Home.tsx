import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  getCurrentDateFormatted,
  useAuth,
  makeCall,
  useAccessibilityAutoFocus
} from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RootStackParamList } from '../types';

const CHECK_CURRENT_DATE_INTERVAL_MILLISECONDS = 60000;

const Home = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const user = useAuth((c) => c.user);
  const [currentDate, setCurrentDate] = useState(getCurrentDateFormatted());
  const { theme, role, constants } = useTheme();

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const styles = buildStyles({ role, theme, constants });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(getCurrentDateFormatted());
    }, CHECK_CURRENT_DATE_INTERVAL_MILLISECONDS);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View
        {...accessibility(
          {
            label: currentDate
          },
          { accessible: true }
        )}
        style={[styles.date, { backgroundColor: theme.secondary }]}
      >
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      <View style={styles.contentWrapper}>
        <Text
          {...accessibility(
            {
              label: `Hola ${user.name}`,
              role: 'text'
            },
            { accessible: true }
          )}
          accessibilityRole='header'
          style={styles.title}
        >
          {`¡Hola ${user.name}!`}
        </Text>
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
              label: 'Realizar una petición',
              hint: 'Ir a realizar una petición',
              role: 'button'
            },
            { accessible: true }
          )}
          text='Realizar una petición'
          onPress={() => navigation.navigate('Wizard')}
        />
        <View style={styles.divider} />
        <Text
          {...accessibility(
            {
              label: '¿Tienes una urgencia?',
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.subtitle}
        >
          ¿Tienes una urgencia?
        </Text>
        <Button
          {...accessibility(
            {
              label: 'Llamar al 112',
              role: 'link'
            },
            { accessible: true }
          )}
          text='Llamar al 112'
          variant='secondary'
          onPress={() => makeCall('112')}
        />
      </View>
    </ScrollView>
  );
};

export default Home;

const buildStyles = ({ theme, constants: { RADIUS, FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bgSecondary },
    contentContainer: { paddingBottom: 44 },
    date: {
      marginTop: 24,
      marginRight: 16,
      borderTopRightRadius: RADIUS.circle,
      borderBottomRightRadius: RADIUS.circle,
      paddingVertical: 12,
      paddingLeft: 20,
      paddingRight: 20,
      alignSelf: 'flex-start'
    },
    dateText: {
      color: theme.fontColorNegative,
      fontFamily: FF.semiBold,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      lineHeight: 24
    },
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
      paddingBottom: 16
    },
    divider: {
      backgroundColor: theme.divider,
      height: 2,
      marginBottom: 24,
      marginTop: 36,
      alignSelf: 'stretch'
    }
  });
