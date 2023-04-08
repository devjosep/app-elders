export enum PushNotificationType {
  ChatSession = 'ChatSession',
  ElderCancelCollaboration = 'ElderCancelCollaboration',
  VolunteerCancelCollaboration = 'VolunteerCancelCollaboration',
  AcceptCollaboration = 'AcceptCollaboration'
}

export type PushNotification = {
  type: PushNotificationType.ChatSession;
  payload: {
    currentUserId: string;
    destinationUserId: string;
    currentUserName: string;
    collaborationType: string;
  };
};
