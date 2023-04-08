import {
  decrypt,
  encrypt,
  getCrytpKey
} from '@client/common/src/chat/utils/crypto';

import { dbService } from '../../database';
import { Messages } from '../../database/entity/messages';
import { Paginated } from '../../shared/paginated';
import { Message } from './domain';

const ITEMS_PER_PAGE = 20;

const getMessages = async (
  currentUserId: string,
  destinationUserId: string,
  cursor = 0
): Promise<Paginated<Message>> => {
  const decryptKey = await getCrytpKey();

  const messages = await dbService
    .getMessageRepository()
    ?.getPaginatedMessages(
      ITEMS_PER_PAGE * cursor,
      ITEMS_PER_PAGE,
      currentUserId,
      destinationUserId
    );

  const messagesDecrypt = messages
    ? (messages.rows.map((messageData) => {
        const messageDecrypted = decrypt(messageData.message, decryptKey);
        return {
          ...messageData,
          message: messageDecrypted,
          date: new Date(messageData.date)
        } as Message;
      }) as Message[])
    : [];

  return {
    items: messagesDecrypt,
    canFetchMore: (cursor + 1) * ITEMS_PER_PAGE < (messages?.count ?? 0),
    nextPage: cursor + 1,
    totalItems: messages?.count ?? 0
  };
};

const addMessages = async (messages: Message[]): Promise<void> => {
  const encryptKey = await getCrytpKey();

  const messagesEncrypted = messages
    .filter((x) => x.message.length > 0)
    .map((messageData) => ({
      ...messageData,
      message: encrypt(messageData.message, encryptKey),
      date: messageData.date.getTime()
    })) as Messages[];

  await dbService.getMessageRepository()?.createMessages(messagesEncrypted);
};

export { getMessages, addMessages };
