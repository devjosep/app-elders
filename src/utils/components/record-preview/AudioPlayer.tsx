import React, { useEffect, useState } from 'react';

import { useAccessibilityAutoFocus, useAudioContext } from '@client/common';

// import { SeekBar } from '../SeekBar';
import { View } from 'react-native/types';

type AudioPlayerProps = {
  fileUrl?: string;
  loading?: boolean;
  autoPlay?: boolean;
  durationMillis?: number;
  downloadFile?: () => void;
};

const AudioPlayer = ({
  fileUrl,
  loading = false,
  autoPlay = true,
  durationMillis = 0,
  downloadFile
}: AudioPlayerProps) => {
  const { announceForAccessibility } = useAccessibilityAutoFocus();

  const {
    fileUrl: audioFileUrl,
    isPlaying,
    positionMillis,
    didJustFinish,
    setFileUrl,
    setPosition,
    soundLoaded,
    pause,
    play
  } = useAudioContext();

  const [isPlayingAP, setIsPlayingAP] = useState<boolean>(false);
  const [positionMillisAP, setPositionMillisAP] = useState<number>(0);

  useEffect(() => {
    if (fileUrl) {
      setFileUrl(fileUrl, positionMillisAP);
    }
  }, [fileUrl]);

  useEffect(() => {
    if (isPlaying && fileUrl === audioFileUrl) {
      setIsPlayingAP(isPlaying);
      setPositionMillisAP(positionMillis);
    } else {
      setIsPlayingAP(false);
    }
  }, [fileUrl, isPlaying, positionMillis]);

  useEffect(() => {
    if (didJustFinish && fileUrl === audioFileUrl) {
      setPositionMillisAP(0);
      announceForAccessibility('Audio finalizado');
    }
  }, [didJustFinish, fileUrl]);

  useEffect(() => {
    if (soundLoaded && fileUrl === audioFileUrl && autoPlay) {
      play(positionMillisAP);
    }
  }, [soundLoaded, fileUrl]);

  const handleOnPlay = () => {
    if (fileUrl) {
      if (!isPlaying && fileUrl === audioFileUrl) {
        play(positionMillisAP);
      } else {
        setFileUrl(fileUrl, positionMillisAP);
      }
    } else {
      downloadFile?.();
    }
  };

  return (<View></View>
    // <SeekBar
    //   state={isPlayingAP ? 'Playing' : 'Pause'}
    //   durationMillis={durationMillis}
    //   positionMillis={positionMillisAP}
    //   onSeek={(positionMillis) => {
    //     if (fileUrl === audioFileUrl) {
    //       setPosition(positionMillis);
    //     }
    //     setPositionMillisAP(positionMillis);
    //   }}
    //   onPlay={handleOnPlay}
    //   onPause={pause}
    //   loading={loading}
    //   disabled={!soundLoaded}
    // />
  );
};

export { AudioPlayer };
