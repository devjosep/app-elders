import React from 'react';
import { View, Image, Text, StyleSheet, Platform , StatusBar} from 'react-native';

// import { useNavigation } from '@react-navigation/core';
// import { StatusBar } from 'expo-status-bar';

// import { useAccessibilityAutoFocus, useAuth } from '@client/common';
// import { NotificationBell } from '@client/ui-components/src/components';
// import { useTheme } from '@client/ui-components/src/utils/useTheme';
import { useTheme } from '../utils';
type HeaderProps = {
  screenName: string;
  autoFocus?: boolean;
  showNotifications?: boolean;
};

const Header = ({
  screenName,
  autoFocus = true,
  showNotifications = true
}: HeaderProps) => {
  // const { accessibility } = useAccessibilityAutoFocus();
  // const { isLoggedIn } = useAuth((s) => s.userCredentials);
  // const isFetcherError = useAuth((s) => s.isFetcherError);
  // const navigation = useNavigation();

  // const { theme, constants } = useTheme();
  // const styles = buildStyles({ theme, constants });

  return (
    <>
      <StatusBar
        // backgroundColor={theme.primary}
        backgroundColor={"#4630eb"}
        // style={Platform.OS === 'android' ? 'light' : 'dark'}
      />
      <View>
        <View
          // {...accessibility(
          //   {
          //     label: `Ventana ${screenName}`,
          //     role: 'header'
          //   },
          //   { accessible: true, autoFocus }
          // )}
          
        >
          <Image source={require('../assets/images/escudoMadrid.png')} />
          <View />
          <View >
            <Image source={require('../assets/images/appTitle.png')} />
            <Text >Madrid te acompaña</Text>
          </View>
        </View>
        {/* {isLoggedIn && !isFetcherError && showNotifications ? (
          <View>
            <NotificationBell
              onPress={() => navigation.navigate('Notifications')}
            />
          </View>
        ) : null} */}
      </View>
    </>
  );
};

const buildStyles = ({ theme, constants: { FF, FS } }: any) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      backgroundColor: theme.primary,
      flexDirection: 'row',
      height: 70,
      padding: 12
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row'
    },
    logoContainer: {
      flex: 1
    },
    separator: {
      backgroundColor: theme.bgSecondary,
      height: '100%',
      marginLeft: 8,
      marginRight: 18,
      width: 2
    },
    slogan: {
      color: theme.fontColorNegative,
      fontFamily: FF.regular,
      fontSize: FS.M,
      letterSpacing: 0.5,
      lineHeight: 25,
      opacity: 0.8
    }
  });

export { Header };
