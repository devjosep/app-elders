import React, { useEffect, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const useCachedResources = (): boolean => {
  const [isLoadResourcesComplete, setIsLoadResourcesComplete] = React.useState(
    false
  );
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const loadResourcesAndData = async (): Promise<void> => {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
          'Poppins Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
          'Poppins SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
          'Poppins Italic': require('../../assets/fonts/Poppins-Italic.ttf'),
          'Poppins Regular': require('../../assets/fonts/Poppins-Regular.ttf')
        });
      } catch (err) {
        setError(err);
      } finally {
        setIsLoadResourcesComplete(true);
      }
    };

    loadResourcesAndData();
  }, []);

  useEffect(() => {
    if (isLoadResourcesComplete) {
      SplashScreen.hideAsync();
    }
  }, [isLoadResourcesComplete]);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return isLoadResourcesComplete;
};

export { useCachedResources };
