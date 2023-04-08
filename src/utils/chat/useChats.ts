import { useCallback } from 'react';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { usePreventNotificationsPush } from '../push/usePreventNotificationsPush';
import { UserType } from '../user';
import { useChatConnectionContext } from './context/ChatConnectionContext';
import { useGetActiveCollaborationsQuery } from './conversations/useGetActiveCollaborations';
import { useGetConversationsQuery } from './conversations/useGetConversations';
import { useAppStateActions } from './hooks/useAppStateActions';
import { useViewStateActions } from './hooks/useViewStateActions';

const useChats = (userType: UserType) => {
  usePreventNotificationsPush();

  const { data: activeCollaborations } =
    useGetActiveCollaborationsQuery(userType);

  const {
    data,
    refetch,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useGetConversationsQuery(userType, activeCollaborations);

  const {
    setConnect,
    onBlurAction,
    setOnBlurAction,
    isConnected: isSignlrConnected
  } = useChatConnectionContext();

  const { isFocused } = useNavigation();

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
      setConnect({ connectState: 'connect' });
    }
  });

  useFocusEffect(
    useCallback(() => {
      setOnBlurAction(true);
      setConnect({ connectState: 'connect' });
      refetch();
    }, [])
  );

  return {
    data,
    refetch,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isSignlrConnected: isSignlrConnected(),
    fetchNextPage,
    hasNextPage
  };
};

export { useChats };
