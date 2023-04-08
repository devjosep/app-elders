import { useState, useEffect } from 'react';

import * as Device from 'expo-device';

const useDeviceRooted = () => {
  const [isRooted, setIsRooted] = useState(false);

  useEffect(() => {
    const checkIsRoot = async () => {
      const rooted = await Device.isRootedExperimentalAsync();
      setIsRooted(rooted);
    };
    checkIsRoot();
  }, []);

  return isRooted;
};

export { useDeviceRooted };
