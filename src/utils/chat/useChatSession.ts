import { useState, useMemo, useCallback, useEffect } from 'react';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMutation } from 'react-query';

import { useAuth } from '../authentication';
import { usePreventNotificationsPush } from '../push/usePreventNotificationsPush';
import {
  SendMessageAttachment,
  useChatConnectionContext
} from './context/ChatConnectionContext';
import { resetPendingToRead } from './conversations/service';
import { useAppStateActions } from './hooks/useAppStateActions';
import { useViewStateActions } from './hooks/useViewStateActions';
import { useGetMessagesQuery } from './messages/useGetMessagesQuery';

type SendMessageChat = {
  attachmentInfo?: SendMessageAttachment;
};

const useChatSession = (
  destinationUserId: string,
  collaborationType: string
) => {
  const { name, cid360 } = useAuth((s) => s.user);
  const [message, setMessage] = useState<string>('');

  const { isFocused } = useNavigation();

  usePreventNotificationsPush();

  const { setConnect, onBlurAction, sendMessage, isConnected } =
    useChatConnectionContext();

  const {
    data: chatMessages,
    fetchNextPage: fetchMore,
    hasNextPage: canFetchMore,
    refetch
  } = useGetMessagesQuery(cid360, destinationUserId, isConnected());

  const data = useMemo(
    () =>
      chatMessages?.pages
        ? chatMessages.pages?.map((group) => group.items.flat()).flat()
        : [],
    [chatMessages]
  );

  const {
    mutateAsync: handleSendMessage,
    isLoading: isSendingMessage,
    isSuccess: sentOk
  } = useMutation<void, Error, SendMessageChat>(
    ({ attachmentInfo }) =>
      sendMessage({
        currentUserId: cid360,
        currentUserName: name,
        destinationUserId,
        message,
        messageDate: new Date(),
        collaborationType,
        attachmentType: attachmentInfo?.attachmentType,
        attachmentSize: attachmentInfo?.attachmentSize,
        attachmentURI: attachmentInfo?.attachmentURI
      }),
    {
      onMutate: () => setMessage('')
    }
  );

  useViewStateActions({
    onBlurView: () => {
      onBlurAction.current && setConnect({ connectState: 'close' });
    }
  });

  useAppStateActions({
    isFocused: isFocused(),
    onBackground: () => {
      setConnect({ connectState: 'close' });
    },
    onActiveFromBackground: () => {
      resetPendingToRead(destinationUserId);
      setConnect({ connectState: 'connect' });
    }
  });

  useEffect(() => {
    setConnect({
      connectState: 'connect',
      destinationUserId
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (data) {
        resetPendingToRead(destinationUserId);
      }
    }, [data])
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [destinationUserId])
  );

  const handleSetMessage = (message: string) => {
    setMessage(message);
  };

  return {
    data,
    isSending: isSendingMessage,
    message,
    handleSetMessage,
    isMessageEmpty: message.length === 0,
    handleSendMessage,
    fetchMore,
    canFetchMore,
    isConnected,
    sentOk
  };
};

export { useChatSession };
