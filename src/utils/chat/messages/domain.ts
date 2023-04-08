import { formattedTime } from '../../utils';

const MESSAGES_KEY = 'messages';
const MESSAGES_CONVERSATION_KEY = (
  currentUserId: string,
  destinationUserId: string
) => [MESSAGES_KEY, { currentUserId, destinationUserId }];

export enum MessageType {
  AUDIO = 1
}

export type Message = {
  id?: number;
  date: Date;
  userA: string;
  userB: string;
  sender: string;
  message: string;
  messageId?: string;
  attachmentType?: MessageType;
  attachmentSize?: number;
  attachmentUrl?: string;
};

export type MessageAttachment = {
  attachmentType?: MessageType;
  attachmentSize?: number;
  attachmentUrl?: string;
};

export type MessageReceived = {
  id: string;
  messageDate: string;
  cid360Origin: string;
  cid360Destination: string;
  message: string;
  collaborationType: string;
};

const translateAttachment = {
  [MessageType.AUDIO]: 'Mensaje de audio'
} as Record<MessageType, string>;

const getMessageAttachmentTranslate = (
  messageType: MessageType,
  size: number
) => {
  return `${translateAttachment[messageType]} ( ${formattedTime(size)} )`;
};

const mapMessageReceivedToMessage = (
  messageReceived: MessageReceived
): Message => {
  const withAttachment = messageReceived.message.includes('attachmentType');
  const messageAttachment = withAttachment
    ? (JSON.parse(messageReceived.message) as MessageAttachment)
    : messageReceived.message;

  const messageAttachentToAdd = withAttachment
    ? (messageAttachment as MessageAttachment)
    : undefined;

  return {
    userA: messageReceived.cid360Destination,
    userB: messageReceived.cid360Origin,
    sender: messageReceived.cid360Origin,
    message: withAttachment
      ? getMessageAttachmentTranslate(
          (messageAttachment as MessageAttachment).attachmentType ??
            MessageType.AUDIO,
          (messageAttachment as MessageAttachment).attachmentSize ?? 0
        )
      : messageReceived.message,
    date: new Date(messageReceived.messageDate),
    messageId: messageReceived.id + new Date().getTime().toString(),
    ...messageAttachentToAdd
  };
};

const getGroupedMessagesBySender = (
  receivedMessages: MessageReceived[]
): Record<string, MessageReceived[]> => {
  const orderedMessages = receivedMessages.reduce((acc, message) => {
    if (!acc[message.cid360Origin]) {
      acc[message.cid360Origin] = [];
    }
    acc[message.cid360Origin].push(message);

    return acc;
  }, {} as Record<string, MessageReceived[]>);

  return orderedMessages;
};

export {
  MESSAGES_KEY,
  MESSAGES_CONVERSATION_KEY,
  mapMessageReceivedToMessage,
  getGroupedMessagesBySender,
  getMessageAttachmentTranslate
};
