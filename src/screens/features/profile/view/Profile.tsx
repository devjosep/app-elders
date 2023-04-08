import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { dbService, useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { ProfilePicture } from '@client/ui-components/src/components/ProfilePicture';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from '../routes';
import { getProfilePicture } from '../service';
import CameraIcon from '../../../../assets/icons/camera.svg';

const Profile = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);

  const { theme, constants, role } = useTheme();

  const styles = buildStyles({ theme, constants, role });
  const deviceWidth = Dimensions.get('window').width;
  const dimensionMeasurement = deviceWidth;

  const navigation =
    useNavigation<StackNavigationProp<RouteParams, 'Profile'>>();

  const handleSignOut = async () => {
    await dbService.close();
    signOut();
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <View style={styles.container}>
        <ImageBackground
          source={require('../../../../assets/images/chicle.png')}
          style={[
            styles.profileBackground,
            {
              height: dimensionMeasurement * 0.75,
              width: dimensionMeasurement * 0.75
            }
          ]}
        >
          <ProfilePicture
            height={dimensionMeasurement * 0.6}
            width={dimensionMeasurement * 0.6}
            user={user.name}
            pictureUrl={getProfilePicture(user.cid360)}
          />
          <TouchableOpacity
            {...accessibility(
              {
                label: 'Cambiar la foto de perfil',
                hint: 'Ir a cambiar la foto de perfil',
                role: 'button'
              },
              { accessible: true }
            )}
            style={styles.btnChangeImage}
            onPress={() => navigation.navigate('CameraInterface')}
          >
            <CameraIcon
              width={40}
              height={40}
              style={styles.iconCamera as never}
            />
          </TouchableOpacity>
        </ImageBackground>
        <Text
          {...accessibility(
            {
              label: user.name,
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.userName}
        >
          {user.name}
        </Text>
        <View style={styles.footer}>
          <Button
            {...accessibility(
              {
                label: 'Editar detalles del perfil',
                hint: 'Ir a editar detalles del perfil',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Editar detalles del perfil'
            onPress={() => navigation.navigate('EditProfile')}
          />
          <View style={styles.marginButtons}>
            <Button
              {...accessibility(
                {
                  label: 'Cambiar contraseña',
                  hint: 'Ir a cambiar contraseña',
                  role: 'button'
                },
                { accessible: true }
              )}
              text='Cambiar contraseña'
              variant='secondary'
              onPress={() => navigation.navigate('ChangePassword')}
            />
          </View>
          <View style={styles.marginButtons}>
            <Button
              {...accessibility(
                {
                  label: 'Eliminar cuenta',
                  hint: 'Ir a eliminar cuenta',
                  role: 'button'
                },
                { accessible: true }
              )}
              text='Eliminar cuenta'
              variant='secondary'
              onPress={() => navigation.navigate('RemoveProfile')}
            />
          </View>
          <View style={styles.marginButtons}>
            <Button
              {...accessibility(
                {
                  label: 'Cerrar sesion',
                  role: 'button'
                },
                { accessible: true }
              )}
              variant='secondary'
              onPress={handleSignOut}
              text='Cerrar sesión'
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const buildStyles = ({ theme, constants: { FF, FS, RADIUS } }: BuildStyles) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.bgSecondary
    },
    scrollViewContainer: {
      flexGrow: 1
    },
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32
    },
    profileBackground: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center'
    },
    btnChangeImage: {
      alignItems: 'center',
      backgroundColor: theme.bgTertiary,
      borderRadius: RADIUS.circle,
      height: 68,
      justifyContent: 'center',
      position: 'absolute',
      bottom: 30,
      right: 10,
      width: 68
    },
    userName: {
      width: '100%',
      color: theme.fontColorBase,
      fontFamily: FF.bold,
      fontSize: FS.XXL,
      lineHeight: 55
    },
    marginButtons: {
      marginTop: 10
    },
    footer: {
      alignSelf: 'stretch',
      marginTop: 25,
      marginBottom: 25
    },
    iconCamera: {
      color: theme.fontColorNegative
    }
  });
