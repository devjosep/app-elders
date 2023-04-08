import { dbService } from '../../database';
import { Paginated } from '../../shared/paginated';
import { UserType } from '../../user';
import { doFetch } from '../../utils';
import {
  getGroupedMessagesBySender,
  mapMessageReceivedToMessage,
  MessageReceived
} from '../messages/domain';
import { getImageFromFileSystem, saveImageToFileSystem } from '../utils/images';
import { getRecipientUserInformation } from '../utils/user';
import { Conversation, updateConversationFromCollaborations } from './domain';

const ITEMS_PER_PAGE = 10;

const getConversations = async (
  userType: UserType,
  activeCollaborations: string[],
  cursor: number = 0
): Promise<Paginated<Conversation>> => {
  const conversations = await dbService
    .getConversationRepository()
    ?.getPaginatedConversations(ITEMS_PER_PAGE * cursor, ITEMS_PER_PAGE);

  const conversationsMap = conversations
    ? (conversations.rows.map((item) => ({
        ...item,
        id: item?.id?.toString(),
        lastMessageDate: new Date(item.lastMessageDate ?? 0),
        hasActiveCollaboration: activeCollaborations.includes(
          item.recipientCid360
        )
      })) as Conversation[])
    : [];

  const conversationWithImages =
    userType === UserType.ELDER
      ? await Promise.all(
          conversationsMap.map(async (e) => {
            const recipientPicture = await getImageFromFileSystem(
              e.recipientPicture ?? ''
            );
            if (recipientPicture) {
              return { ...e, recipientPicture };
            }
            return e;
          })
        )
      : conversationsMap;

  return {
    items: conversationWithImages,
    canFetchMore: (cursor + 1) * ITEMS_PER_PAGE < (conversations?.count ?? 0),
    nextPage: cursor + 1,
    totalItems: conversations?.count ?? 0
  };
};

const createEmptyConversation = async (
  updateConversationsData: updateConversationFromCollaborations
): Promise<void> => {
  const {
    recipientCid360,
    recipientName,
    recipientPicture,
    collaborationType,
    userType
  } = updateConversationsData;

  const db = await dbService.getConversationRepository();

  const conversation = await db?.getConversation(recipientCid360);

  if (!conversation) {
    let uri = recipientPicture;

    if (userType === UserType.ELDER) {
      uri = await saveImageToFileSystem(recipientPicture, recipientCid360);
    }

    await db?.createConversations({
      collaborationType,
      recipientCid360: recipientCid360.toString(),
      recipientName,
      recipientPicture: uri,
      pendingToRead: 0
    });
  }
};

const updateConversationData = async (
  messages: MessageReceived[],
  userType: UserType,
  isCurrentConversation?: boolean
) => {
  const orderedMessages = messages.sort(
    (itemA, itemB) =>
      new Date(itemB.messageDate).getTime() -
      new Date(itemA.messageDate).getTime()
  );

  const { cid360Origin, collaborationType, messageDate } = orderedMessages[0];
  const mapMessage = mapMessageReceivedToMessage(orderedMessages[0]);

  const db = await dbService.getConversationRepository();

  const conversation = await db?.getConversation(cid360Origin);

  if (!conversation) {
    const userInfo = await getRecipientUserInformation(userType, cid360Origin);

    await db?.createConversations({
      collaborationType,
      recipientName: userInfo.name,
      recipientCid360: cid360Origin,
      recipientPicture: userInfo.image,
      lastMessage: mapMessage.message,
      lastMessageDate: new Date(messageDate).getTime(),
      pendingToRead: messages.length
    });
  }

  return await db?.updateConversations({
    ...conversation,
    collaborationType,
    lastMessage: mapMessage.message,
    lastMessageDate: new Date(messageDate).getTime(),
    recipientCid360: cid360Origin,
    pendingToRead: isCurrentConversation
      ? 0
      : (conversation?.pendingToRead ?? 0) + messages.length
  });
};

const updateConversations = async (
  userType: UserType,
  currentConversationDestionationId?: string,
  ...messages: MessageReceived[]
) => {
  const groupMessages = getGroupedMessagesBySender(messages);

  if (Object.keys(groupMessages).length > 0) {
    for (const recipientUser of Object.keys(groupMessages)) {
      await updateConversationData(
        groupMessages[recipientUser],
        userType,
        currentConversationDestionationId === recipientUser
      );
    }
  }
};

const updateConversation = async (
  cid360: string,
  message: string,
  messageDate: string
) => {
  const dbRepository = await dbService.getConversationRepository();
  const conversation = await dbRepository?.getConversation(cid360);

  await dbRepository?.updateConversations({
    ...conversation,
    lastMessage: message,
    lastMessageDate: new Date(messageDate).getTime(),
    recipientCid360: cid360
  });
};

const resetPendingToRead = async (cid360: string) => {
  const db = await dbService.getConversationRepository();
  const conversation = await db?.getConversation(cid360);

  return await db?.updateConversations({
    ...conversation,
    recipientCid360: cid360,
    pendingToRead: 0
  });
};

const getActiveCollaborations = async (
  userType: UserType
): Promise<string[]> => {
  return userType === UserType.VOLUNTEER
    ? doFetch<null, string[]>({
        url: 'collaboration/volunteer/activeelder',
        method: 'GET'
      })
    : doFetch<null, string[]>({
        url: 'collaboration/elder/activevolunteer',
        method: 'GET'
      });
};

export {
  getConversations,
  createEmptyConversation,
  updateConversation,
  updateConversations,
  resetPendingToRead,
  getActiveCollaborations
};
