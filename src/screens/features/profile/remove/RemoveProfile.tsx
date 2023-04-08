import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useMutation } from 'react-query';

import { useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Button, Loading } from '@client/ui-components/src/components';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { removeProfile as removeProfileService } from '../service';

const RemoveProfile = () => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();

  const signOut = useAuth((d) => d.signOut);
  const user = useAuth((d) => d.user);

  const navigation = useNavigation();

  const { mutateAsync: removeProfile, isLoading } = useMutation(
    removeProfileService,
    {
      onSuccess: () => {
        Alert.alert('Cuenta eliminada correctamente');
        signOut();
      }
    }
  );
  const { theme, constants, role } = useTheme();

  const styles = buildStyles({ theme, constants, role });

  useEffect(() => {
    isLoading && announceForAccessibility('Eliminando cuenta');
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ¡Importante!, si eliminas la cuenta ya no podrás acceder a la
        aplicación. ¿Deseas continuar?
      </Text>
      <View style={styles.buttonWrapper}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Button
              {...accessibility(
                { label: 'Atrás', hint: 'Ir a perfil', role: 'button' },
                { accessible: true }
              )}
              style={styles.buttonLeft}
              text='Atrás'
              onPress={() => navigation.navigate('Profile')}
            />
            <Button
              {...accessibility(
                { label: 'Eliminar', role: 'button' },
                { accessible: true }
              )}
              style={styles.buttonRight}
              variant='secondary'
              text='Eliminar'
              onPress={() => removeProfile({ username: user.email })}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default RemoveProfile;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bgSecondary,
      justifyContent: 'space-between',
      alignItems: 'stretch',
      paddingHorizontal: 16
    },
    title: {
      fontFamily: FF.regular,
      color: theme.fontColorBase,
      fontSize: FS.L,
      letterSpacing: 0.3,
      lineHeight: 24,
      paddingHorizontal: 8
    },
    buttonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 20
    },
    buttonLeft: {
      flex: 1,
      marginRight: 5
    },
    buttonRight: {
      flex: 1,
      marginLeft: 5
    }
  });
