import React, { Suspense, useEffect, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  ListRenderItemInfo,
  RefreshControl
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Conversation, UserType, useChats } from '@client/common';
import { Loading } from '@client/ui-components/src/components/Loading';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { NoCollaborations } from '../../components/NoCollaborations';
import { ChatItem } from './Chats/ChatItem';

const ChatsInner = () => {
  const { theme, role, constants } = useTheme();
  const loaded = useRef<boolean>(false);
  const navigation = useNavigation();

  const styles = buildStyles({ theme, role, constants });

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isSignlrConnected,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useChats(UserType.ELDER);

  useEffect(() => {
    const unsubscribeblur = navigation.addListener('blur', () => {
      loaded.current = false;
    });

    return unsubscribeblur;
  }, [navigation]);

  useEffect(() => {
    loaded.current = true;
  }, []);

  const checkFetchNextPage = () => {
    if (hasNextPage && loaded.current && !isFetching && !isLoading) {
      return fetchNextPage();
    }
  };

  const chats = (data?.pages?.map((group) => group.items) ?? []).flat();

  return (
    <FlatList
      style={styles.listContainer}
      contentContainerStyle={styles.contentContainer}
      data={chats}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      renderItem={({ item }: ListRenderItemInfo<Conversation>) => (
        <ChatItem chat={item} />
      )}
      keyExtractor={(item, index) => `${item.id?.toString()}_${index}`}
      onEndReached={({ distanceFromEnd }) => {
        distanceFromEnd > 0 && checkFetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      refreshControl={
        <RefreshControl
          refreshing={
            isFetching || isFetchingNextPage || isLoading || !isSignlrConnected
          }
          onRefresh={refetch}
        />
      }
      ListEmptyComponent={() => <NoCollaborations status='Conversation' />}
    />
  );
};

const Chats = () => (
  <Suspense fallback={<Loading />}>
    <ChatsInner />
  </Suspense>
);

const buildStyles = ({ role, theme }: BuildStyles) =>
  StyleSheet.create({
    listContainer: {
      flex: 1,
      backgroundColor: role === 'elders' ? theme.bgSecondary : theme.bgDefault
    },
    contentContainer: {
      flexGrow: 1
    },
    divider: {
      height: 2,
      opacity: 0.3,
      backgroundColor: theme.divider
    }
  });

export default Chats;
