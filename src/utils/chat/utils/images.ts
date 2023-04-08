import * as FileSystem from 'expo-file-system';

const getImageFromFileSystem = async (recipientPicture: string) => {
  if (recipientPicture) {
    const url_parts = recipientPicture.replace(/\/\s*$/, '').split('/');
    const directory = FileSystem.documentDirectory;
    const recipientPicturePath = directory + url_parts[url_parts.length - 1];
    try {
      const fileInfo = await FileSystem.getInfoAsync(recipientPicturePath);
      recipientPicture = fileInfo.exists
        ? await FileSystem.readAsStringAsync(recipientPicturePath, {
            encoding: FileSystem.EncodingType.Base64
          })
        : '';
    } catch {
      // Fix, don't break the app if an image doesn't exists
      recipientPicture = '';
    }
  }
  return recipientPicture;
};

const saveImageToFileSystem = async (
  recipientPicture: string,
  cid360: string
): Promise<string> => {
  const directory = FileSystem.documentDirectory;
  const uri = directory + cid360;

  if (!recipientPicture) {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri);
    }
    return '';
  }

  await FileSystem.writeAsStringAsync(uri, recipientPicture, {
    encoding: FileSystem.EncodingType.Base64
  });

  return uri;
};

export { getImageFromFileSystem, saveImageToFileSystem };
