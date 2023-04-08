import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useWrapperRef } from '../../utils/useWrapperRef';

type ViewStateActions = {
  onFocusView?: () => void;
  onBlurView?: () => void;
};

const useViewStateActions = ({ onFocusView, onBlurView }: ViewStateActions) => {
  const { addListener } = useNavigation();
  const onFocusViewRef = useWrapperRef(onFocusView);
  const onBlurViewRef = useWrapperRef(onBlurView);

  useEffect(() => {
    const focusSubscription = addListener('focus', () => {
      onFocusViewRef.current?.();
    });

    const blurSubscription = addListener('blur', () => {
      onBlurViewRef.current?.();
    });

    return () => {
      focusSubscription();
      blurSubscription();
    };
  }, []);
};

export { useViewStateActions };
