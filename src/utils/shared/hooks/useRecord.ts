import { useState } from 'react';
import { Alert } from 'react-native';

import { Audio } from 'expo-av';

const UPDATE_INTERVAL_MILLIS = 50;

const useRecord = () => {
  const [recording, setRecording] = useState<Audio.Recording>();
  const [status, setStatus] = useState<Audio.RecordingStatus>();
  const [uri, setUri] = useState<string>();

  const setInitialState = () => {
    setUri('');
    setRecording(undefined);
    setStatus(undefined);
  };

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
        });

        setInitialState();

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
          setStatus,
          UPDATE_INTERVAL_MILLIS
        );

        setRecording(recording);
      } else {
        Alert.alert(
          'Permisos de micrófono',
          'Sin permisos para acceder al micrófono.',
          [
            {
              text: 'Ok'
            }
          ],
          { cancelable: false }
        );
      }
    } catch (err) {
      Alert.alert(
        'Error en la grabación',
        'Ah ocurrido un error al intentar grabar audio.',
        [
          {
            text: 'Ok'
          }
        ],
        { cancelable: false }
      );
    }
  };

  const stopRecording = async () => {
    if (recording && status?.isRecording) {
      try {
        const status = await recording.stopAndUnloadAsync();
        const uri = recording.getURI() ?? '';
        recording.setOnRecordingStatusUpdate(null);
        setUri(uri);
        setRecording(recording);
        setStatus(status);
        console.info('Recording stopped and stored at', uri);
      } catch {
        console.info("Recording stopped but didn't store at", uri);
      }
    }
  };

  const removeRecording = () => {
    setInitialState();
  };

  return {
    startRecording,
    stopRecording,
    removeRecording,
    status: {
      isRecording: status?.isRecording,
      durationMillis: status?.durationMillis,
      isDoneRecording: status?.isDoneRecording,
      fileUrl: uri
    }
  };
};

export { useRecord };
