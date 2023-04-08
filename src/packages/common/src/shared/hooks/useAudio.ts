import { useEffect, useRef, useState } from 'react';

import { Audio, AVPlaybackStatus, AVPlaybackStatusToSet } from 'expo-av';

const UPDATE_INTERVAL_MILLIS = 50;

const useAudio = () => {
  const sound = useRef<Audio.Sound>();
  const [status, setStatus] = useState<AVPlaybackStatus>();

  const intervalId = useRef<number | undefined>();

  const startInterval = () => {
    intervalId.current = setInterval(async () => {
      if (status?.isLoaded && sound.current) {
        const status = await sound.current.getStatusAsync();

        if (status.isLoaded) {
          setStatus({ ...status, isPlaying: true });
        }
      }
    }, UPDATE_INTERVAL_MILLIS) as unknown as number;
  };

  const clearCurrenterInterval = () => {
    if (intervalId?.current) {
      clearInterval(intervalId.current);
    }
  };

  useEffect(() => {
    return () => {
      clearCurrenterInterval();
      sound.current?.pauseAsync();
    };
  }, []);

  useEffect(() => {
    if (status?.isLoaded && status.positionMillis > 0) {
      const { positionMillis, durationMillis } = status;
      if (
        intervalId.current &&
        durationMillis &&
        positionMillis === durationMillis
      ) {
        (async () => {
          if (sound.current && status?.isLoaded) {
            clearCurrenterInterval();
            await sound.current.pauseAsync();
            sound.current.setPositionAsync(0);
            setStatus({
              ...status,
              isPlaying: false,
              positionMillis: 0,
              didJustFinish: true
            });
          }
        })();
      }
    }
  }, [status]);

  const loadSound = async (
    uri: string,
    options: Pick<AVPlaybackStatusToSet, 'shouldPlay' | 'positionMillis'>
  ) => {
    try {
      console.info('loading sound...', uri);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
      });

      const { sound: soundAudio, status } = await Audio.Sound.createAsync(
        { uri },
        {
          ...options,
          shouldCorrectPitch: true,
          volume: 1.0,
          isMuted: false
        }
      );
      sound.current = soundAudio;
      setStatus(status);
    } catch (err) {
      console.error('Failed to start sound', err);
    }
  };

  const play = async (fromPosition: number | undefined) => {
    if (sound.current && status?.isLoaded) {
      console.info('PLAY SOUND');
      await sound.current.playFromPositionAsync(
        fromPosition ?? status.positionMillis
      );
      setStatus({ ...status, isPlaying: true });
      startInterval();
    }
  };

  const pause = async () => {
    if (sound.current && status?.isLoaded) {
      console.info('PAUSE SOUND');
      clearCurrenterInterval();
      await sound.current.pauseAsync();
      setStatus({ ...status, isPlaying: false });
    }
  };

  const unload = async () => {
    if (sound.current) {
      clearCurrenterInterval();
      await sound.current.pauseAsync();
      await sound.current.unloadAsync();
      sound.current = undefined;
      setStatus(undefined);
    }
  };

  const setPosition = async (positionMillis: number) => {
    if (sound.current && status?.isLoaded) {
      if (status.isPlaying) {
        sound.current.playFromPositionAsync(positionMillis);
      } else {
        await sound.current.setPositionAsync(positionMillis);
        const status = await sound.current.getStatusAsync();
        setStatus(status);
      }
    }
  };

  return {
    loadSound,
    play,
    pause,
    unload,
    setPosition,
    status: {
      soundLoaded: status?.isLoaded,
      isPlaying: status?.isLoaded ? status.isPlaying : false,
      positionMillis: status?.isLoaded ? status.positionMillis : 0,
      durationMillis: status?.isLoaded ? status.durationMillis : 0,
      didJustFinish: status?.isLoaded ? status.didJustFinish : false
    }
  };
};

export { useAudio };
