import React, { Suspense, useMemo } from 'react';
import {
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  RefreshControl
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useInfiniteQuery, useQuery } from 'react-query';

import {
  Paginated,
  Collaboration,
  CollaborationStatus,
  getCollaborations,
  CollaborationRequestType,
  getElderCollaborations
} from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { Loading } from './Loading';

type ItemToRenderProps = {
  collaboration: Collaboration;
};

type CollaborationListProps = {
  collaborationRequestType: CollaborationRequestType;
  status: CollaborationStatus[];
  collaborationTypes: number[];
  locations?: number[];
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  itemSeparatorComponent: React.FC;
  itemToRender: React.FC<ItemToRenderProps>;
  emptyListComponent: React.FC;
  type_force: number
};

const CollaborationListInner = ({
  collaborationRequestType,
  status,
  locations,
  startDate,
  endDate,
  startTime,
  endTime,
  collaborationTypes,
  itemSeparatorComponent: ItemSeparatorComponent,
  itemToRender: ItemToRender,
  emptyListComponent: EmptyListComponent,
  type_force
}: CollaborationListProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery<Paginated<Collaboration>>(
    [
      'collaborations',
      collaborationRequestType,
      status,
      collaborationTypes,
      locations,
      startDate,
      endDate
    ],
    ({ pageParam = 0 }) =>
      getCollaborations(
        'collaborations',
        collaborationRequestType,
        status,
        collaborationTypes ?? [9],
        locations ?? [],
        startDate = new Date(),
        endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        startTime,
        endTime,
        pageParam

      ),

    {
      getNextPageParam: (lastPage) => {
        return lastPage?.canFetchMore ? lastPage.nextPage - 1 : undefined;
      },
      enabled: false,
      useErrorBoundary: true
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])

  );

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const collaborations = useQuery('GetElderCollaborations', getElderCollaborations)

  const lengtharray = collaborations.data?.value.length - 1

  // console.log("...data  .. ", data?.pages[0].value[4])
  let new_data_force = data?.pages[0].value.filter(item => {
    if (type_force == 1 && (item.status == "accept" || item.status == "active")) { return item }
    if (type_force == 2 && (item.status == "expired" || item.status == "undoned")) { return item }
  }
  )

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      // data={array}
      // data={collaborations?.data?.value}
      // data={data?.pages[0].value}
      data={new_data_force}
      ItemSeparatorComponent={() => <ItemSeparatorComponent />}
      renderItem={({ item }: ListRenderItemInfo<Collaboration>) =>
        item ? <ItemToRender collaboration={item} /> : null

      }
      keyExtractor={(item, index) =>
        `${item?.id?.toString() ?? 'unknown_key'}_${index}` ?? `_${index}`
      }
      onEndReached={() => hasNextPage && !isFetching && fetchNextPage()}
      ListEmptyComponent={() => <EmptyListComponent />}
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

const CollaborationList = (props: CollaborationListProps) => (
  <Suspense fallback={<Loading />}>
    <CollaborationListInner {...props} />
  </Suspense>
);

export { CollaborationList };

const buildStyles = ({ theme }: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16
    },
    contentContainer: {
      flexGrow: 1,
      paddingBottom: 40
    }
  });
