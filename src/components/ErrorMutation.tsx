import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RouteParams } from 'navigation/routes';
import { ScrollView } from 'react-native-gesture-handler';
import { useQueryErrorResetBoundary } from 'react-query';

import { useAccessibilityAutoFocus } from '@client/common/';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

const ErrorMutation = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const navigation = useNavigation();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });
  const { reset } = useQueryErrorResetBoundary();

  const {
    params: { message }
  } = useRoute<RouteProp<RouteParams, 'ErrorMutation'>>();

  const messageDescription = message
    ? message
    : 'Se ha producido un error inesperado. Inténtalo de nuevo más tarde.';

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <View style={styles.imageWrapper}>
        <Image
          {...accessibility({ role: 'none' }, { accessible: false })}
          style={styles.image}
          source={require('../assets/images/error.png')}
        />
      </View>
      <View style={styles.contentWrapper}>
        <View
          {...accessibility(
            {
              label: `Lo sentimos. ${messageDescription}`,
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.textWrapper}
        >
          <Text style={styles.title}>Lo sentimos...</Text>
          <Text style={styles.description}>{messageDescription}</Text>
        </View>
        {navigation.canGoBack() && (
          <View style={styles.actions}>
            <Button
              {...accessibility(
                {
                  label: 'Atrás',
                  role: 'button'
                },
                { accessible: true }
              )}
              text='Atrás'
              variant='secondary'
              onPress={() => {
                reset();
                navigation.goBack();
              }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.bgSecondary
    },
    scrollViewContainer: {
      flexGrow: 1,
      paddingBottom: 32
    },
    imageWrapper: {
      flexShrink: 1
    },
    contentWrapper: {
      flex: 1,
      paddingHorizontal: 16
    },
    image: { width: '90%', height: '100%', alignSelf: 'center' },
    textWrapper: {
      flex: 0.75,
      paddingHorizontal: 8,
      marginBottom: 32
    },
    actions: {
      flex: 0.25,
      justifyContent: 'flex-end'
    },
    title: {
      fontFamily: FF.bold,
      color: theme.fontColorBase,
      fontSize: 25,
      lineHeight: 36
    },
    description: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.XM,
      lineHeight: 24,
      letterSpacing: 0.3
    }
  });

export { ErrorMutation };
