import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SvgProps } from 'react-native-svg';

import { useAccessibilityAutoFocus } from '@client/common';

import ChevronLeft from '../../assets/icons/chevronLeft.svg';
import { useTheme } from '../utils';

type SectionHeaderProps = {
  section: string;
  goBackText?: string;
  screenName?: string;
  showGoBack?: boolean;
  autoFocus?: boolean;
  icon: React.FC<SvgProps>;
};

const SectionHeader = ({
  section,
  screenName,
  showGoBack = true,
  autoFocus = true,
  goBackText = 'Volver',
  icon: Icon
}: SectionHeaderProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const navigation = useNavigation();
  const { theme, constants } = useTheme();

  const styles = buildStyles({ theme, constants });

  return (
    <>
      <StatusBar backgroundColor='white' style='dark' />
      <View style={styles.container}>
        <View style={styles.backContainer}>
          {showGoBack ? (
            <TouchableOpacity
              {...accessibility(
                {
                  label: screenName
                    ? `Ventana ${screenName}. ${goBackText}`
                    : goBackText,
                  role: 'button'
                },
                { autoFocus, accessible: true }
              )}
              style={styles.goBack}
              onPress={() => {
                navigation.goBack();
              }}>
              <ChevronLeft
                height={20}
                width={20}
                style={styles.goBackIcon as never}
              />
              <Text style={styles.goBackText}>{goBackText}</Text>
            </TouchableOpacity>
          ) : (
            <View
              {...accessibility(
                {
                  label: section
                },
                { autoFocus, accessible: true }
              )}
            />
          )}
        </View>
        <View style={styles.titleContainer}>
          <View style={styles.verticalDivider} />
          <Text
            {...accessibility(
              { label: `Ventana ${section}` },
              {
                accessible: false,
                importantForAccessibility: 'no-hide-descendants',
                accessibilityElementsHidden: true
              }
            )}
            style={styles.msgText}
            numberOfLines={1}
            lineBreakMode='tail'>
            {section}
          </Text>
          <Icon style={styles.msgIcon} width={28} height={28} />
        </View>
      </View>
    </>
  );
};

export { SectionHeader };

const buildStyles = ({ theme, constants: { FS, FF } }: any) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: theme.bgSecondary,
      flexDirection: 'row',
      height: 70,
      justifyContent: 'space-between',
      paddingHorizontal: 16
    },
    backContainer: {
      flex: 0.3
    },
    titleContainer: {
      justifyContent: 'flex-end',
      flex: 0.7,
      flexDirection: 'row',
      alignItems: 'center'
    },
    goBack: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      color: theme.cGoBack
    },
    goBackIcon: {
      color: theme.cGoBack
    },
    goBackText: {
      color: theme.cGoBack,
      fontFamily: FF.medium,
      fontSize: FS.LL,
      marginLeft: 5,
      marginTop: Platform.select({ android: 4, ios: 0 }),
      letterSpacing: 0.3
    },
    verticalDivider: {
      width: 2,
      height: 20,
      backgroundColor: theme.fontColorBase,
      marginHorizontal: 12
    },
    msgIcon: {
      flex: 0.1,
      color: theme.fontColorBase
    },
    msgText: {
      flexShrink: 1,
      fontFamily: FF.semiBold,
      fontSize: FS.L,
      letterSpacing: 0.3,
      color: theme.fontColorBase,
      marginRight: 5
    }
  });
