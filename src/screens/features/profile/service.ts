import Constants from 'expo-constants';

import { doFetch, ElderInformation } from '@client/common';

import {
  ChangePasswordFormModel,
  ProfileModel,
  RemoveProfileModel
} from './domain';

const {
  manifest: {
    extra: {
      blobStorage: { accountName, sharedKey, imageContainerName }
    }
  }
} = Constants as any;

export const getProfile = async (token: string): Promise<ElderInformation> =>
  doFetch<void, ElderInformation>({
    url: 'elder',
    method: 'GET',
    token
  });

const updateProfile = async (profileModel: ProfileModel): Promise<void> =>
  doFetch<ProfileModel>({
    url: 'elder',
    method: 'PUT',
    request: profileModel
  });

const changePassword = async (
  changePassword: ChangePasswordFormModel
): Promise<void> =>
  doFetch<ChangePasswordFormModel>({
    url: 'elder/elder/passwordchange',
    method: 'PUT',
    request: changePassword
  });

const removeProfile = async (user: RemoveProfileModel): Promise<void> =>
  doFetch<RemoveProfileModel>({
    url: 'elder/elder/unsuscribe',
    method: 'PUT',
    request: user
  });

const getProfilePicture = (cid360: string) =>
  `https://${accountName}.blob.core.windows.net/${imageContainerName}/${cid360}.jpg${sharedKey}${`&refreshDate=${new Date().getTime()}`}`;

const uploadImage = async (
  fileUri: string,
  cid360: string
): Promise<Response> => {
  const fileName = `${cid360}.jpg`;

  const formData = new FormData();
  formData.append('image', {
    uri: fileUri,
    name: fileName,
    type: 'image/jpg'
  });

  return doFetch({
    url: 'elder/image',
    method: 'POST',
    request: formData,
    withStringify: false,
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
};

export {
  updateProfile,
  getProfilePicture,
  uploadImage,
  changePassword,
  removeProfile
};
