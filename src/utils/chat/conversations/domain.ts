import { UserType } from '../../user';

const CONVERSATIONS_KEY = 'conversations';
const CONVERSATION_KEY = (currentUserId: string, destinationUserId: string) => [
  CONVERSATIONS_KEY,
  { currentUserId, destinationUserId }
];
const ACTIVE_COLLABORATIONS_KEY = 'activeCollaborations';

const CHECK_QUESTIONARY_KEY = 'checkQuestionary';

export type Conversation = {
  id?: string;
  collaborationType: string;
  lastMessage?: string;
  status?: number;
  lastMessageDate?: Date;
  recipientName: string;
  recipientPicture?: string;
  recipientCid360: string;
  pendingToRead: number;
  hasActiveCollaboration: boolean;
};

export type updateConversationFromCollaborations = {
  recipientCid360: string;
  recipientName: string;
  recipientPicture: string;
  collaborationType: string;
  userType: UserType;
};

export type CheckCollaborationRequest = {
  elderCid360: string;
};

export type CheckQuestionary = {
  lastEvaluation: string;
};

export {
  CONVERSATIONS_KEY,
  CONVERSATION_KEY,
  ACTIVE_COLLABORATIONS_KEY,
  CHECK_QUESTIONARY_KEY
};
