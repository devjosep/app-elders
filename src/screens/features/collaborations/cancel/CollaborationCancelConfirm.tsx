import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from '../routes';
import { useAccessibilityAutoFocus } from '@client/common';

const CollaborationCancelConfirm = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const navigation =
    useNavigation<
      StackNavigationProp<RouteParams, 'CollaborationCancelConfirm'>
    >();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <View style={styles.imageWrapper}>
        <Image
          {...accessibility(
            { role: 'image' },
            {
              accessible: false,
              accessibilityElementsHidden: true,
              importantForAccessibility: 'no-hide-descendants'
            }
          )}
          style={styles.image}
          source={require(`../../../../assets/images/cancelada.png`)}
        />
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.textWrapper}>
          <Text
            style={styles.caption}
            {...accessibility(
              {
                label: 'Se ha cancelado correctamente tu petición',
                role: 'text'
              },
              { accessible: true, autoFocus: true }
            )}
          >
            Se ha cancelado correctamente tu petición
          </Text>
        </View>
        <View style={styles.buttons}>
          <Button
            {...accessibility(
              {
                label: 'Realizar otra petición',
                hint: 'Ir a realizar otra petición',
                role: 'button'
              },
              { accessible: true }
            )}
            style={styles.button}
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name: 'Home' }, { name: 'Wizard' }]
                })
              )
            }
            text='Realizar otra petición'
          />
          <Button
            {...accessibility(
              {
                label: 'Ver mis peticiones',
                hint: 'Ir al listado de peticiones',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Ver mis peticiones'
            variant='secondary'
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name: 'Home' }]
                })
              );
              navigation.navigate('Collaborations');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CollaborationCancelConfirm;

const buildStyles = ({ role, theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.bgSecondary
    },
    container: {
      flexGrow: 1,
      paddingBottom: 18
    },
    imageWrapper: { flexShrink: 1 },
    contentWrapper: {
      flex: 1,
      paddingHorizontal: 24
    },
    textWrapper: { flex: 0.8, marginBottom: 18 },
    buttons: {
      flex: 0.2,
      justifyContent: 'flex-end'
    },
    image: {
      width: '100%',
      height: '100%',
      alignSelf: 'center'
    },
    caption: {
      fontFamily: FF.regular,
      fontSize: role === 'elders' ? FS.XM : FS.M,
      lineHeight: 24,
      letterSpacing: role === 'elders' ? 0.3 : 0,
      color: theme.fontColorBase
    },
    button: {
      marginBottom: 18
    }
  });
