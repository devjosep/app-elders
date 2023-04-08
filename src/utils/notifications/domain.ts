const HAS_NOTIFICATIONS_KEY = ['notifications', 'unread'];
const NOTIFICATIONS_KEY = 'notifications';

export enum NotificationType {
  Message = 0,
  EvaluationPending = 1,
  Evaluation
}

export type Notification = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  type?: NotificationType;
  serviceId: number;
};

export { HAS_NOTIFICATIONS_KEY, NOTIFICATIONS_KEY };
