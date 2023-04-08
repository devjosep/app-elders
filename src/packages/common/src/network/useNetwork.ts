import { useState, useEffect, useRef } from 'react';

import Constants from 'expo-constants';

import { useAppStateActions } from '../chat';
import { checkService } from './service';

const { serviceUrl } = Constants.manifest!.extra!;

const INTERVAL_CHECK_MILLISECONDS = 5000;
const CHECK_URL = `${serviceUrl}/health-api-9148c3c7-c4ec-4dca-bcb1-9d3db23597c9`;

type UseNetwork = {
  hasNetwork: boolean;
};

const useNetwork = (): UseNetwork => {
  const [hasNetwork, setHasNetwork] = useState(true);
  const intervalId = useRef<ReturnType<typeof setTimeout>>();

  const checkServiceHandler = async () => {
    try {
      await checkService(CHECK_URL);
      setHasNetwork(true);
    } catch (_) {
      setHasNetwork(false);
    }
  };

  const startInterval = () => {
    if (intervalId.current) {
      return;
    }

    checkServiceHandler();
    intervalId.current = setInterval(
      checkServiceHandler,
      INTERVAL_CHECK_MILLISECONDS
    );
  };

  const closeInterval = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = undefined;
    }
  };

  useAppStateActions({
    onBackground: () => {
      closeInterval();
    },
    onActiveFromBackground: () => {
      startInterval();
    }
  });

  useEffect(() => {
    startInterval();

    return closeInterval;
  }, []);

  return { hasNetwork };
};

export { useNetwork };
