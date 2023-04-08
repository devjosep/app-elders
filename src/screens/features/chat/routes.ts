import { Conversation } from '@client/common/';

export type RouteParams = {
  Chats: undefined;
  ChatSession: {
    destinationUserId: string;
    collaborationType: string;
  };
  ChatItem: {
    chat: Conversation;
  };
};
