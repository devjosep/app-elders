import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AccessibilityActionEvent,
  Platform
} from 'react-native';

import Slider from '@react-native-community/slider';

import { formattedTime, formmatedTimeA11Y } from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { Loading } from './Loading';
// import Pause from '../../../assets/icons/pause.svg';
// import Play from '../../../assets/icons/play.svg';

const A11Y_SLIDER_GAP = 1000;

type SeekBarState = 'Playing' | 'Pause';

type SeekBarProps = {
  state: SeekBarState;
  positionMillis: number;
  durationMillis: number;
  loading?: boolean;
  disabled?: boolean;
  onSeek?: (positionMillis: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
};

const SeekBar = ({
  state,
  positionMillis,
  durationMillis,
  loading = false,
  onSeek,
  onPlay,
  onPause
}: SeekBarProps) => {
  const isSliding = React.useRef(false);
  const [previewPositionMillis, setPreviewPositionMillis] =
    React.useState(positionMillis);

  const { theme, constants } = useTheme();
  const stylesSeekBar = styles({ theme, constants });

  useEffect(() => {
    if (!isSliding.current && positionMillis !== previewPositionMillis) {
      setPreviewPositionMillis(positionMillis);
    }
  }, [positionMillis]);

  const handleSwipeForA11y = (event: AccessibilityActionEvent) => {
    switch (event.nativeEvent.actionName) {
      case 'increment':
        onSeek?.(
          Math.min(previewPositionMillis + A11Y_SLIDER_GAP, durationMillis)
        );
        break;
      case 'decrement':
        onSeek?.(Math.max(previewPositionMillis - A11Y_SLIDER_GAP, 0));
    }
  };
// 
  return (
    <View style={stylesSeekBar.container}>
      {loading ? (
        <View style={stylesSeekBar.loading}>
          <Loading color={theme.seekBartintColor} />
        </View>
      ) : (
        <TouchableOpacity
          accessible
          accessibilityLabel='Botón reproducir o parar audio'
          style={stylesSeekBar.actionButton}
          onPress={() => (state === 'Playing' ? onPause?.() : onPlay?.())}
        >
          {/* {state === 'Playing' ? (
            // <Pause height={32} width={32} color={theme.seekBartintColor} />
          ) : (
            // <Play height={32} width={32} color={theme.seekBartintColor} />
          )} */}
        </TouchableOpacity>
      )}

      <Slider
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        accessibilityRole='adjustable'
        onAccessibilityAction={
          Platform.OS === 'android' ? handleSwipeForA11y : undefined
        }
        style={stylesSeekBar.slider}
        minimumValue={0}
        maximumValue={durationMillis}
        maximumTrackTintColor='#000000'
        minimumTrackTintColor={theme.seekBartintColor}
        thumbTintColor={theme.seekBartintColor}
        accessibilityValue={{
          text: formmatedTimeA11Y(previewPositionMillis),
          now: previewPositionMillis,
          min: 0,
          max: durationMillis
        }}
        value={previewPositionMillis}
        onValueChange={(millis) =>
          state === 'Playing' && setPreviewPositionMillis(millis)
        }
        onSlidingStart={() => {
          isSliding.current = true;
        }}
        onSlidingComplete={(value) => {
          isSliding.current = false;
          onSeek?.(value);
        }}
      />
      <View
        accessible
        accessibilityLabel={formmatedTimeA11Y(
          isSliding.current
            ? previewPositionMillis
            : positionMillis === 0
            ? durationMillis
            : positionMillis
        )}
      >
        <Text style={stylesSeekBar.durationText}>
          {formattedTime(
            isSliding.current
              ? previewPositionMillis
              : positionMillis === 0
              ? durationMillis
              : positionMillis
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = ({
  theme,
  constants: { FF, FS }
}: Pick<BuildStyles, 'theme' | 'constants'>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.bgDefault,
      paddingHorizontal: 10,
      alignItems: 'center',
      textAlignVertical: 'center',
      justifyContent: 'space-between',
      borderRadius: 25,
      height: 40
    },
    actionButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 48,
      height: 48
    },
    loading: {
      width: 48
    },
    slider: {
      flexGrow: 1
    },
    durationText: {
      fontFamily: FF.medium,
      color: theme.fontColorBase,
      fontSize: FS.XM,
      textAlign: 'center',
      textAlignVertical: 'center',
      alignSelf: 'center',
      lineHeight: 26,
      width: 60
    }
  });

export { SeekBar };
