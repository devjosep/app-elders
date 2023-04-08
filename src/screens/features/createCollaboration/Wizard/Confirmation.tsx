import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Button } from '@client/ui-components/src/components';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from '../routes';

const Confirmation = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const user = useAuth((state) => state.user);
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const navigation =
    useNavigation<StackNavigationProp<RouteParams, 'Confirmation'>>();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <View style={styles.container}>
        <Image
          {...accessibility({ role: 'none' }, { accessible: false })}
          style={styles.image}
          source={require(`../../../../assets/images/solicitudEnviada.png`)}
        />
        <View style={styles.wrapper}>
          <Text
            {...accessibility(
              {
                label: `¡Enhorabuena ${user.name}!`,
                role: 'text'
              },
              { accessible: true }
            )}
            style={styles.title}
          >{`¡Enhorabuena ${user.name}!`}</Text>
          <Text
            {...accessibility(
              {
                label: 'Tu solicitud ha sido enviada.',
                role: 'text'
              },
              { accessible: true }
            )}
            style={styles.caption}
          >
            Tu solicitud ha sido enviada.
          </Text>
          <Text
            {...accessibility(
              {
                label: 'Cuando haya un voluntario disponible te avisaremos.',
                role: 'text'
              },
              { accessible: true }
            )}
            style={[styles.caption, styles.captionMargin]}
          >
            Cuando haya un voluntari@ disponible te avisaremos.
          </Text>
        </View>
      </View>
      <View style={[styles.buttonBar]}>
        <View style={{ marginBottom: 24 }}>
          <Button
            {...accessibility(
              {
                label: 'Realizar otra petición',
                hint: 'Ir a realizar otra petición',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Realizar otra petición'
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name: 'Home' }, { name: 'Wizard' }]
                })
              )
            }
          />
        </View>
        <Button
          {...accessibility(
            {
              label: 'Ver mis peticiones',
              hint: 'Ir a mis peticiones',
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
    </ScrollView>
  );
};

export default Confirmation;

const buildStyles = ({ role, theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.bgSecondary
    },
    scrollViewContainer: {
      flexGrow: 1,
      paddingBottom: 32
    },
    container: {
      justifyContent: 'flex-start'
    },
    wrapper: {
      paddingHorizontal: 24,
      paddingBottom: 16,
      marginTop: -30
    },
    image: {
      marginTop: -50,
      alignSelf: 'center'
    },
    title: {
      color: theme.fontColorBase,
      fontFamily: FF.bold,
      fontSize: 25,
      letterSpacing: role === 'elders' ? 0.3 : 0,
      textAlign: 'center',
      paddingBottom: 16
    },
    caption: {
      fontFamily: FF.regular,
      fontSize: role === 'elders' ? FS.XM : FS.M,
      lineHeight: 24,
      letterSpacing: role === 'elders' ? 0.3 : 0,
      color: theme.fontColorBase
    },
    captionMargin: {
      marginTop: 8
    },
    buttonBar: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 32
    }
  });
