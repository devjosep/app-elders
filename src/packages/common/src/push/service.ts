import { doFetch } from '../utils';

export const registerNotificationPushToken = (
  userCid360: string,
  token: string
) =>
  doFetch({
    url: 'pushNotification',
    method: 'POST',
    request: { cid360: userCid360, channel: token }
  });
