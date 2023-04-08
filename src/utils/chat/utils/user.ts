import { ElderInformation, UserType, VolunteerInformation } from '../../user';
import { doFetch, getProfilePicture } from '../../utils';
import { saveImageToFileSystem } from './images';

const getRecipientUserInformation = async (
  userType: UserType,
  cid360Origin: string
) => {
  let recipientUserInformation = {
    name: '',
    image: ''
  };

  if (userType === UserType.VOLUNTEER) {
    const result = await doFetch<null, ElderInformation>({
      url: `elder/${cid360Origin}`,
      method: 'GET'
    });

    if (result) {
      recipientUserInformation = {
        name: result.name,
        image: getProfilePicture(cid360Origin)
      };
    }
  } else {
    const result = await doFetch<null, VolunteerInformation>({
      url: `volunteer/${cid360Origin}`,
      method: 'GET'
    });

    if (result) {
      recipientUserInformation = {
        name: result.name,
        image: result?.image
          ? await saveImageToFileSystem(result.image, cid360Origin)
          : ''
      };
    }
  }
  return recipientUserInformation;
};

export { getRecipientUserInformation };
