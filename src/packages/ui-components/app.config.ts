import { ExpoConfig, ConfigContext } from '@expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'frontend-ui-components',
  slug: 'frontend-ui-components',
  scheme: 'frontenduicomponents',
  version: '1.0.0',
  platforms: [],
  extra: {
    authorityUrl:
      process.env.authorityUrl ??
      'https://app-aytomadrid-identity.azurewebsites.net',
    serviceUrl: 'https://app-madridteacompana.azurewebsites.net',
    apiVersion: '1.0',
    blobStorage: {
      accountName: 'aytostoragepro',
      sharedKey:
        '?sp=rl&st=2021-02-05T09:59:55Z&se=2065-01-06T09:59:00Z&sv=2019-12-12&sr=c&sig=%2Fr%2FrLrLY6W1%2Fz0ClT12kbc%2F7j5Y5jQZxqMkW2NKdPEA%3D',
      imageContainerName: process.env.blobStorageImageContainerName ?? 'images'
    }
  }
});
