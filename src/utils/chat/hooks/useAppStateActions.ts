import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useWrapperRef } from '../../utils/useWrapperRef';

type AppStateActions = {
  onBackground?: () => void;
  onActiveFromBackground?: () => void;
  isFocused?: boolean;
  name?: string;
};

const useAppStateActions = ({
  onBackground,
  onActiveFromBackground,
  isFocused = true
}: AppStateActions) => {
  const appStateRef = useRef(AppState.currentState);
  const onBackgroundRef = useWrapperRef(onBackground);
  const onActiveFromBackgroundRef = useWrapperRef(onActiveFromBackground);
  const isFocusedRef = useWrapperRef(isFocused);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === appStateRef.current) {
        return;
      }

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (isFocusedRef.current) {
          onActiveFromBackgroundRef.current?.();
        }
      } else if (nextAppState === 'background') {
        onBackgroundRef.current?.();
      }

      appStateRef.current = nextAppState;
    };

    appStateRef.current = AppState.currentState;
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
};

export { useAppStateActions };
