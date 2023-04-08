import { useAccessibilityAutoFocus } from '@client/common';
import React, { useCallback, ReactNode, FC } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  TabView as TabComponent,
  SceneRendererProps,
  NavigationState,
  Route,
  TouchableItem
} from 'react-native-tab-view';

import { Loading } from '../components/Loading';
import { useTheme, BuildStyles } from '../utils';

export type TabHeaderItemProps = {
  route: Route;
  routeIndex: number;
  selectedRouteIndex: number;
};

type TabViewProps<T extends Route> = {
  routes: T[];
  routesMap: Record<string, ReactNode>;
  tabHeaderCommon?: FC;
  tabHeaderItem: FC<TabHeaderItemProps>;
};

function TabView<T extends Route>({
  routes,
  routesMap,
  tabHeaderItem: TabHeaderItem,
  tabHeaderCommon: TabHeaderCommon
}: TabViewProps<T>) {
  const { accessibility } = useAccessibilityAutoFocus();
  const [index, setIndex] = React.useState(0);
  const renderScene = ({ route }: SceneRendererProps & { route: Route }) =>
    routesMap[route.key];

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const renderTabBar = useCallback(
    ({
      navigationState: { index: selectedRouteIndex, routes }
    }: SceneRendererProps & {
      navigationState: NavigationState<Route>;
    }) => (
      <View>
        {TabHeaderCommon ? <TabHeaderCommon /> : null}
        <View style={styles.tabBar}>
          {routes.map((route, routeIndex) => (
            <TouchableItem
              {...accessibility(
                {
                  label: route.title,
                  role: 'tab',
                  state: { selected: selectedRouteIndex === routeIndex }
                },
                { accessible: true }
              )}
              key={route.key}
              style={[
                styles.tabItem,
                selectedRouteIndex === routeIndex ? styles.isSelected : {}
              ]}
              onPress={() => setIndex(routeIndex)}>
              <TabHeaderItem
                route={route as T}
                routeIndex={routeIndex}
                selectedRouteIndex={selectedRouteIndex}
              />
            </TouchableItem>
          ))}
        </View>
      </View>
    ),
    [setIndex]
  );

  return (
    <TabComponent
      lazy
      style={{ backgroundColor: theme.bgSecondary }}
      renderLazyPlaceholder={() => <Loading />}
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
    />
  );
}

export { TabView };

const buildStyles = ({ role, theme, constants: { RADIUS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: theme.bgSecondary,
      flex: 1,
      justifyContent: 'center'
    },
    scene: {
      flex: 1
    },
    tabBar: {
      backgroundColor: theme.bgSecondary,
      borderBottomWidth: role === 'elders' ? 2 : 1,
      flexDirection: 'row',
      borderBottomColor:
        role === 'elders' ? theme.fontColorBase : theme.bgDefault
    },
    tabItem: {
      alignItems: 'center',
      borderBottomColor: 'transparent',
      borderColor: 'transparent',
      borderTopLeftRadius: RADIUS.S,
      borderTopRightRadius: RADIUS.S,
      borderWidth: 2,
      flex: 1,
      marginBottom: role === 'elders' ? -2 : 0,
      marginHorizontal: role === 'elders' ? 20 : 0,
      paddingBottom: 12,
      paddingHorizontal: 16,
      paddingTop: 16
    },
    isSelected: {
      backgroundColor: theme.bgSecondary,
      borderBottomColor: role === 'elders' ? theme.bgSecondary : theme.primary,
      borderBottomWidth: role === 'elders' ? 3 : 4,
      borderColor: role === 'elders' ? theme.fontColorBase : 'transparent'
    },
    isFocused: {
      borderColor: theme.bcInputFocus,
      color: theme.fcInputFocus
    }
  });
