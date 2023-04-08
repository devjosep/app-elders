import React, { PropsWithChildren, useEffect, useState } from 'react';

import { configuration } from 'configuration';
import AppLoading from 'expo-app-loading';
import { useCachedResources } from '../hooks/useCachedResources';

import { useAuth, UserType } from '@client/common';

import { getProfile } from 'features/profile/service';

const LoadResources = ({ children }: PropsWithChildren<object>) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { loadResourcesAndData } = useCachedResources();
  const { initialize: initializeAuth } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([
          loadResourcesAndData(),
          initializeAuth({
            authConfig: {
              authorityUrl: configuration.AUTHORITY_URL,
              clientId: configuration.CLIENT_ID,
              scopes: configuration.SCOPES,
              tokenEndpoint: configuration.TOKEN_ENDPOINT
            },
            getUserProfile: getProfile,
            userType: UserType.ELDER
          })
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsInitializing(false);
      }
    };
    initialize();
  }, []);

  return isInitializing ? <AppLoading /> : <>{children}</>;
};

export { LoadResources };
