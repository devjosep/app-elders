import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { CollaborationStatus, useAccessibilityAutoFocus } from '@client/common';
import {
  TabView,
  Button,
  CollaborationList,
  TabHeaderItemProps
} from '@client/ui-components/src/components';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { NoCollaborations } from '../../components/NoCollaborations';
import { CollaborationItem } from './Collaborations/CollaborationItem';

type RouteKeys = 'pending' | 'done';

type Route = {
  key: RouteKeys;
  title: string;
};

const routes: Route[] = [
  { key: 'pending', title: 'En marcha' },
  { key: 'done', title: 'Pasadas' }
];

const routesMap = {
  pending: (
    <CollaborationList
      collaborationRequestType='ELDER'
      status={[CollaborationStatus.Active, CollaborationStatus.Accept]}
      itemSeparatorComponent={() => <View style={styles.separator} />}
      itemToRender={CollaborationItem}
      emptyListComponent={() => <NoCollaborations status='Running' />}
      type_force={1}
    />
  ),
  done: (
    <CollaborationList
      collaborationRequestType='ELDER'
      status={[CollaborationStatus.Undone, CollaborationStatus.Finished]}
      itemSeparatorComponent={() => <View style={styles.separator} />}
      itemToRender={CollaborationItem}
      emptyListComponent={() => <NoCollaborations status='Closed' />}
      type_force={2}
    />
  )
};

const TabHeaderCommon = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const navigation = useNavigation();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View style={styles.newCollaboration}>
      <Button
        {...accessibility(
          {
            label: 'Nueva petición',
            hint: 'Ir a crear nueva petición',
            role: 'button'
          },
          { accessible: true }
        )}
        text='Nueva petición'
        variant='primary'
        onPress={() => navigation.navigate('Wizard')}
      />
    </View>
  );
};

const TabHeaderItem = ({
  route,
  routeIndex,
  selectedRouteIndex
}: TabHeaderItemProps) => {
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <Text
      style={[
        styles.tabItemLabel,
        routeIndex === selectedRouteIndex
          ? styles.isSelected
          : styles.isUnselected
      ]}
      numberOfLines={1}
      ellipsizeMode='tail'
    >
      {route.title}
    </Text>
  );
};

const Collaborations = () => (
  <TabView<Route>
    routes={routes}
    routesMap={routesMap}
    tabHeaderItem={TabHeaderItem}
    tabHeaderCommon={TabHeaderCommon}
  />
);

export default Collaborations;

const styles = StyleSheet.create({
  separator: {
    height: 20
  }
});

const buildStyles = ({ role, theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    newCollaboration: {
      backgroundColor: theme.bgSecondary,
      paddingHorizontal: 32,
      paddingVertical: 16
    },
    tabItem: {
      alignItems: 'center',
      borderBottomColor: theme.divider,
      borderBottomWidth: 1,
      flex: 1,
      padding: 16
    },
    tabItemLabel: {
      flexWrap: 'nowrap',
      fontFamily: FF.medium,
      fontSize: role === 'elders' ? FS.XM : FS.M,
      letterSpacing: role === 'elders' ? 0.3 : 0
    },
    isUnselected: {
      color: theme.secondary,
      borderBottomWidth: 2,
      borderBottomColor: theme.secondary
    },
    isSelected: {
      color: theme.fontColorBase
    }
  });
