import React, {
  Context,
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { useAudio } from '../../shared/hooks/useAudio';
import { useAppStateActions } from '../hooks/useAppStateActions';

type AudioContextState = {
  fileUrl: string;
  isPlaying: boolean;
  soundLoaded: boolean;
  soundDurationMillis: number;
  positionMillis: number;
  didJustFinish: boolean;
  setFileUrl: (fileUrl: string | undefined, positionMillis: number) => void;
  setPosition: (positionMillis: number) => void;
  play: (fromPosition: number | undefined) => void;
  pause: () => void;
};

const AudioContext = createContext<Partial<AudioContextState>>(
  {}
) as Context<AudioContextState>;

const useAudioContext = (): AudioContextState => useContext(AudioContext);

const AudioProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const positionMillisLoad = useRef<number>(0);

  const {
    loadSound,
    play,
    pause,
    unload,
    setPosition,
    status: {
      soundLoaded,
      isPlaying,
      positionMillis,
      durationMillis: soundDurationMillis = 0,
      didJustFinish
    }
  } = useAudio();

  useAppStateActions({
    onBackground: () => {
      pause();
    }
  });

  useEffect(() => {
    if (fileUrl) {
      (async () => {
        await loadSound(fileUrl, {
          shouldPlay: false,
          positionMillis: positionMillisLoad.current
        });
      })();
    }
  }, [fileUrl]);

  const handleSetFileUrl = async (
    fileUrl: string | undefined,
    positionMillis: number
  ) => {
    positionMillisLoad.current = positionMillis;
    await unload();
    setFileUrl(fileUrl);
  };

  const value = useMemo(
    () =>
      ({
        fileUrl,
        isPlaying,
        soundLoaded,
        soundDurationMillis,
        positionMillis,
        didJustFinish,
        setFileUrl: handleSetFileUrl,
        setPosition,
        play,
        pause
      } as AudioContextState),
    [
      fileUrl,
      isPlaying,
      soundLoaded,
      soundDurationMillis,
      positionMillis,
      didJustFinish,
      handleSetFileUrl,
      setPosition,
      play,
      pause
    ]
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export { useAudioContext, AudioProvider };
