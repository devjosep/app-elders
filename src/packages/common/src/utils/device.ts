import 'react-native-get-random-values';
import { Platform } from 'react-native';

import * as Application from 'expo-application';
import uuidv4 from 'uuid/v4';
import uuidv5 from 'uuid/v5';

const UUID_NAMESPACE = '29cc8a0d-747c-5f85-9ff9-f2f16636d963';

const getDeviceUniqueId = async (): Promise<string> => {
  let installationId;

  if (['android', 'ios'].includes(Platform.OS)) {
    let identifierForVendor;

    if (Platform.OS === 'android') {
      identifierForVendor = Application.androidId;
    } else {
      identifierForVendor = await Application.getIosIdForVendorAsync();
    }

    const bundleIdentifier = Application.applicationId;

    if (identifierForVendor) {
      installationId = uuidv5(
        `${bundleIdentifier}-${identifierForVendor}`,
        UUID_NAMESPACE
      );
    } else {
      const installationTime = await Application.getInstallationTimeAsync();
      installationId = uuidv5(
        `${bundleIdentifier}-${installationTime.getTime()}`,
        UUID_NAMESPACE
      );
    }
  } else {
    installationId = uuidv4();
  }

  return installationId;
};

export { getDeviceUniqueId };
