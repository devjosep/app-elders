import { Paginated } from '../shared/paginated';
import { doFetch } from '../utils';
import { Notification } from './domain';

const ITEMS_PER_PAGE = 20;

type GetNotificationsRequest = {
  items: number;
  skip: number;
};

export type PostRatingMutation = {
  id: number;
  rate: number;
};

const getUnreadNotificationsCount = (): Promise<number> =>
  doFetch<void, number>({
    url: 'notification/unread/count',
    method: 'GET'
  });

const getNotifications = (
  cursor: number = 0
): Promise<Paginated<Notification>> =>
  doFetch<void, Paginated<Notification>, GetNotificationsRequest>({
    url: 'notification',
    method: 'GET',
    queryString: {
      items: ITEMS_PER_PAGE,
      skip: cursor * ITEMS_PER_PAGE
    }
  });

const postReadNotification = (id: number): Promise<void> =>
  doFetch<void, void>({
    url: `notification/${id}/read`,
    method: 'POST'
  });

const postRatingCollaboration = (data: PostRatingMutation): Promise<void> =>
  doFetch({
    url: `rate/collaboration/${data.id}/elder/rate`,
    method: 'POST',
    request: { rate: data.rate + 1 }
  });

export {
  getUnreadNotificationsCount,
  getNotifications,
  postReadNotification,
  postRatingCollaboration
};
