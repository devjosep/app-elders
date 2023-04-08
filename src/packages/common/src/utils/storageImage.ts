import Constants from 'expo-constants';

const {
  manifest: {
    extra: {
      blobStorage: { accountName, sharedKey, imageContainerName }
    }
  }
} = Constants;

const getProfilePicture = (cid360: string) =>
  `https://${accountName}.blob.core.windows.net/${imageContainerName}/${cid360}.jpg${sharedKey}${`&refreshDate=${new Date().getTime()}`}`;

export { getProfilePicture };
