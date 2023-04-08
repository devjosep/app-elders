import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Platform, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Camera, CameraPictureOptions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

import { useAccessibilityAutoFocus, useAuth } from '@client/common';

import { RouteParams } from '../routes';
import { uploadImage } from '../service';
import CameraControl from './cameraControl/CameraControl';
import CameraPreviewButtons from './cameraPreviewButtons/CameraPreviewButtons';

const CameraInterface = () => {
  const navigation =
    useNavigation<StackNavigationProp<RouteParams, 'Profile'>>();
  const user = useAuth((state) => state.user);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [storedPhoto, setStoredPhoto] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const cameraRef = useRef<Camera>(null);

  const { announceForAccessibility } = useAccessibilityAutoFocus();

  useEffect(() => {
    cameraType === Camera.Constants.Type.front
      ? announceForAccessibility('Cámara frontal activada')
      : announceForAccessibility('Cámara trasera activada');
  }, [cameraType]);

  useEffect(() => {
    const checkCameraPermissions = async () => {
      const { status } = await Camera.getCameraPermissionsAsync();

      if (status === 'granted') {
        setHasCameraPermission(true);
        return;
      }

      if (status === 'denied' && Platform.OS === 'ios') {
        Alert.alert(
          'Permisos de cámara',
          'Sin permisos para acceder a la cámara.',
          [{ text: 'Ok', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Permisos de cámara',
          'La App Madrid te Acompaña quiere acceder a tu cámara para poner tu imagen del perfil',
          [
            {
              text: 'Atrás',
              onPress: () => navigation.goBack()
            },
            {
              text: 'Solicitar permiso',
              onPress: async () => {
                const { status: requestStatus } =
                  await Camera.requestCameraPermissionsAsync();

                if (requestStatus === 'granted') {
                  setHasCameraPermission(true);
                } else {
                  navigation.goBack();
                }
              }
            }
          ],
          { cancelable: false }
        );
      }
    };

    checkCameraPermissions();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      announceForAccessibility('haciendo foto');
      const options = {
        quality: 0.5,
        base64: true,
        skipProcessing: true
      } as CameraPictureOptions;

      const data = await cameraRef.current.takePictureAsync(options);

      if (data) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        setStoredPhoto(data.uri);
      }
    }
  };

  const switchCamera = () =>
    setCameraType((prevCameraType: any) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );

  const cancelPreview = async () => {
    await cameraRef.current?.resumePreview();
    setIsPreview(false);
  };

  const savePhoto = async () => {
    announceForAccessibility('Modificando foto de perfil');
    setIsSaving(true);
    const resizePhoto = await ImageManipulator.manipulateAsync(storedPhoto, [
      { resize: { width: 640 } }
    ]);
    await uploadImage(resizePhoto.uri, user.cid360);
    setIsSaving(false);
    navigation.navigate('Profile');
  };

  return hasCameraPermission ? (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.container}
        type={cameraType}
        flashMode={Camera.Constants.FlashMode.auto}
        autoFocus={Camera.Constants.AutoFocus.on}
        onCameraReady={onCameraReady}
        onMountError={(error) => Alert.alert('Camera error', error.message)}
      />
      <View style={styles.container}>
        {isPreview ? (
          <CameraPreviewButtons
            isSaving={isSaving}
            cancelPreview={cancelPreview}
            savePhoto={savePhoto}
          />
        ) : (
          <CameraControl
            isCameraReady={isCameraReady}
            onSwitchCamera={switchCamera}
            onTakePicture={takePicture}
          />
        )}
      </View>
    </View>
  ) : (
    <View />
  );
};

export default CameraInterface;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  media: {
    ...StyleSheet.absoluteFillObject
  },
  recordIndicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity: 0.7
  },
  recordTitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center'
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: '#ff0000',
    marginHorizontal: 5
  },
  text: {
    color: '#fff'
  }
});
