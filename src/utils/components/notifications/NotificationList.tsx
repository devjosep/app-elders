import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  ListRenderItemInfo,
  RefreshControl,
  View,
  SectionList
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  useGetNotificationsQuery,
  Notification,
  getDistanceDaysString,
  useAppStateActions
} from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { EmptyList } from '../EmptyList';
import { NotificationListItem } from './NotificationList/NotificationListItem';
import { NotificationListSectionHeader } from './NotificationList/NotificationListSectionHeader';

const NotificationList = () => {
  const {
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage
  } = useGetNotificationsQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  useAppStateActions({
    onActiveFromBackground: () => {
      refetch();
    }
  });

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const notifications = useMemo(
    () => data?.pages?.flatMap((group) => group?.items ?? []),
    [data]
  );

  const groupedNotificationsByDay = useMemo(() => {
    if (!notifications) {
      return [];
    }
    const groupedByDate = notifications.reduce((acc, notification) => {
      const distance = getDistanceDaysString(
        new Date(notification.createdAt),
        "dd 'de' MMMM 'de' yyyy"
      );
      if (!acc[distance]) {
        acc[distance] = [];
      }
      acc[distance].push(notification);
      acc[distance].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return acc;
    }, {} as Record<string, Notification[]>);

    return Object.entries(groupedByDate).map(([key, value]) => ({
      title: key,
      day: value[0].createdAt,
      data: value
    }));
  }, [notifications]);

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      sections={groupedNotificationsByDay}
      stickySectionHeadersEnabled
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }: ListRenderItemInfo<Notification>) =>
        item ? <NotificationListItem notification={item} /> : null
      }
      keyExtractor={(item, index) =>
        `${item?.id?.toString() ?? 'unknown_key'}_${index}`
      }
      renderSectionHeader={({ section: { title, day } }) => (
        <NotificationListSectionHeader title={title} day={day} />
      )}
      onEndReached={() => hasNextPage && fetchNextPage()}
      ListEmptyComponent={<EmptyList message='No tienes notificaciones ' />}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      refreshControl={
        <RefreshControl
          refreshing={isFetching || isFetchingNextPage}
          onRefresh={refetch}
        />
      }
    />
  );
};

const buildStyles = ({ theme }: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      flex: 1,
      paddingHorizontal: 16
    },
    contentContainer: {
      flexGrow: 1,
      paddingBottom: 40
    },
    separator: {
      height: 6
    }
  });

export { NotificationList };
