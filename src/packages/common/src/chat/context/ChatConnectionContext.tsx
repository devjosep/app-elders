import React, {
  Context,
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { useAuth } from '../../authentication';
import { uploadAttachment } from '../../shared/services';
import { useUpdateConversationMutation } from '../conversations/useUpdateConversationMutation';
import { useUpdateConversationsMutation } from '../conversations/useUpdateConversationsMutation';
import { ConnectionState, useSignalR } from '../hooks/useSignalR';
import {
  getMessageAttachmentTranslate,
  mapMessageReceivedToMessage,
  MessageReceived
} from '../messages/domain';
import { useAddMessagesMutation } from '../messages/useAddMessagesMutation';
import { addPrefixAttachment, removePrefixAttachment } from './utils/utils';

type ConnnectState = {
  destinationUserId?: string;
  connectState?: ConnectionState;
};

type ChatConnectionType = {
  serviceUrl: string;
};

export type SendMessageAttachment = {
  attachmentType?: number;
  attachmentSize?: number;
  attachmentURI?: string;
};

type SendMessageType = {
  currentUserId: string;
  currentUserName: string;
  destinationUserId: string;
  message: string;
  messageDate: Date;
  collaborationType: string;
} & SendMessageAttachment;

type ChatConnectionContextState = {
  sendMessage: (configMessage: SendMessageType) => Promise<void>;
  setConnect: (connect: ConnnectState) => void;
  isConnected: () => boolean;
  onBlurAction: RefObject<boolean>;
  setOnBlurAction: (notBlur: boolean) => void;
};

const ChatConnectionContext = createContext<
  Partial<ChatConnectionContextState>
>({}) as Context<ChatConnectionContextState>;

const useChatConnectionContext = (): ChatConnectionContextState =>
  useContext(ChatConnectionContext);

const ChatConnectionProvider = ({
  serviceUrl,
  children
}: PropsWithChildren<ChatConnectionType>) => {
  const [connectState, setConnectState] = useState<ConnnectState>();
  const onBlurAction = useRef(true);

  const { userType } = useAuth((s) => s.user);
  const getToken = useAuth((s) => s.getToken);
  const setIsFetcherError = useAuth((u) => u.setIsFetcherError);

  const { mutateAsync: addMessages } = useAddMessagesMutation();
  const { mutateAsync: updateConversations } = useUpdateConversationsMutation(
    userType,
    connectState?.destinationUserId
  );
  const { mutateAsync: updateConversation } = useUpdateConversationMutation();

  const {
    send,
    isConnected: isConnectedSignlR,
    sendImmediate,
    hasError
  } = useSignalR<MessageReceived>(
    `${serviceUrl}/chat`,
    'ReceiveMessage',
    async (message, transactionId) => {
      const messageReceived = {
        ...message,
        message: removePrefixAttachment(message.message)
      };

      if (transactionId) {
        await sendImmediate('MessageReceived', transactionId);
      }
      if (messageReceived) {
        await updateConversations([messageReceived]);
        await addMessages([mapMessageReceivedToMessage(messageReceived)]);
      }
    },
    'ReceivePendingMessage',
    async (receivedMessages) => {
      const messages = receivedMessages.map((message) => ({
        ...message,
        message: removePrefixAttachment(message.message)
      }));

      if (messages?.length) {
        await sendImmediate(
          'PendingMessagesIdsReceived',
          messages.map((m) => m.id)
        );
        await updateConversations(messages);
        await addMessages(messages?.map(mapMessageReceivedToMessage));
      }
    },
    { accessTokenFactory: async () => (await getToken()) ?? '' },
    connectState?.connectState
  );

  useEffect(() => {
    if (hasError) {
      setIsFetcherError(true);
    }
  }, [hasError]);

  const sendMessage = async (messageData: SendMessageType) => {
    const {
      currentUserId,
      currentUserName,
      destinationUserId,
      message,
      messageDate,
      collaborationType,
      attachmentType,
      attachmentSize,
      attachmentURI
    } = messageData;

    try {
      let messageToSend = '';
      let attachmentUrl = '';

      if (attachmentURI && attachmentType) {
        attachmentUrl = await (await uploadAttachment(attachmentURI)).filePath;

        messageToSend = addPrefixAttachment(
          JSON.stringify({
            attachmentUrl,
            attachmentType,
            attachmentSize
          }),
          attachmentType
        );
      } else {
        messageToSend = message;
      }

      await send(
        'SendMessage',
        currentUserName,
        destinationUserId,
        messageToSend,
        collaborationType
      );

      await updateConversation({
        cid360: destinationUserId,
        message: attachmentType
          ? getMessageAttachmentTranslate(attachmentType, attachmentSize ?? 0)
          : message,
        messageDate: messageDate.toUTCString()
      });

      addMessages([
        {
          userA: currentUserId,
          userB: destinationUserId,
          sender: currentUserId,
          message: attachmentType
            ? getMessageAttachmentTranslate(attachmentType, attachmentSize ?? 0)
            : message,
          date: messageDate,
          attachmentType,
          attachmentSize,
          attachmentUrl
        }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const setConnect = (connect: ConnnectState) => {
    return setConnectState(connect);
  };

  const isConnected = () => {
    return isConnectedSignlR;
  };

  const setOnBlurAction = (notBlur: boolean) => {
    onBlurAction.current = notBlur;
  };

  const value = useMemo(
    () =>
      ({
        sendMessage,
        setConnect,
        isConnected,
        onBlurAction,
        setOnBlurAction
      } as ChatConnectionContextState),
    [sendMessage, setConnect, isConnected]
  );

  return (
    <ChatConnectionContext.Provider value={value}>
      {children}
    </ChatConnectionContext.Provider>
  );
};

export { ChatConnectionProvider, useChatConnectionContext };
