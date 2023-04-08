import { useEffect, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

const useCachedResources = () => {
  const [error, setError] = useState<Error>();

  const loadResourcesAndData = async (): Promise<void> => {
    try {
      Asset.fromModule(require('../assets/images/error.png')).downloadAsync();
      // Load fonts
      await Font.loadAsync({
        ...Ionicons.font,
        'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        'Poppins Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
        'Poppins Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins Italic': require('../assets/fonts/Poppins-Italic.ttf'),
        'Poppins Regular': require('../assets/fonts/Poppins-Regular.ttf')
      });
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { loadResourcesAndData };
};

export { useCachedResources };
