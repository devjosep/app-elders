import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

// import {
//   getFocusedRouteNameFromRoute,
//   RouteProp
// } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { ErrorMutation } from '../components/ErrorMutation';

// import {
//   useNetwork,
//   useRegisterPushNotificationsToken,
//   useAuth,
//   useChatConnectionContext,
// NavigationContainer,
//   dbService
// // } from '../utils/common';
// } from '@client/common';

// import {
//   SectionHeader,
//   TokenExpired,
//   ErrorWithSignout
// // } from '../components';
// } from '@client/ui-components/src/components';



// import { Error } from '../components/Error';
// import { Header } from '../components/Header';
// import NotFoundScreen from '../screens/NotFoundScreen';
// import OfflineScreen from '../screens/OfflineScreen';
// import { BottomTabParamList, RootStackParamList } from './types';
import { RootStackParamList } from './types';
// import LinkingConfiguration from './LinkingConfiguration';
// import { BottomTabNavigator } from './MainNavigator/BottomTabNavigator';
// import { NavigationIcon } from './MainNavigator/NavigationIcon';
import { ErrorBoundaryWrapper } from './shared/components/ErrorBoundaryWrapper';
// import ChatSession from '../screens/features/chat/ChatSession';
// import { StackRoutes as CollaborationsRoutes } from '../screens/features/collaborations/routes';
// import { StackRoutes as CreateCollaborationRoutes } from '../screens/features/createCollaboration/routes';
// import { StackRoutes as LoginRoutes } from '../screens/features/login/routes';
// import { StackRoutes as NotificationRoutes } from '../screens/features/notifications/routes';
// import { StackRoutes as ProfileStackRoutes } from '../screens/features/profile/routes';
// import { StackRoutes as RecoveryStackRoutes } from '../screens/features/recovery/routes';
// import { StackRoutes as RegisterStackRoutes } from '../screens/features/register/routes';
import { StackRoutes as WelcomeRoutes } from '../screens/welcome/routes';
import Welcome from '../screens/welcome/Welcome';

const Stack = createStackNavigator<RootStackParamList>();

// const HeaderTitle = {
//   Home: 'Inicio',
//   Collaborations: 'Listado de peticioness',
//   Messages: 'Listado de mensajes',
//   Profile: 'Perfil'
// } as Record<keyof BottomTabParamList, string>;



// const getHeaderTitle = (route: RouteProp<RootStackParamList, 'Home'>) => {
//   const routeName = (getFocusedRouteNameFromRoute(route) ??
//     'Home') as keyof BottomTabParamList;

//   return HeaderTitle[routeName];
// };

const generateRoutes = (routeObject: any) =>
  routeObject.map((route: any) => (
    <Stack.Screen
      key={route.routeName}
      name={route.routeName}
      options={() => {
        const RouteHeader = route.header;
        const screenName = route.screenName;
        const autoFocus = route.autoFocus;
        return {
          header: () => (
            <RouteHeader screenName={screenName} autoFocus={autoFocus} />
          )
        };
      }}
    >
      {ErrorBoundaryWrapper(route.component)}
    </Stack.Screen>
  ));

const MainNavigator = () => {
  // const { isLoggedIn, isTokenExpired } = useAuth((s:any) => s.userCredentials);
  // const isFetcherError = useAuth((s:any) => s.isFetcherError);
  // const { cid360 } = useAuth((s:any) => s.user);
  // const { setConnect } = useChatConnectionContext();

  // const { hasNetwork } = useNetwork();
  // useRegisterPushNotificationsToken(cid360);

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     (async () => {
  //       if (!dbService.getIsConnected()) {
  //         await dbService.connect(`asist.${cid360}.db`);
  //       }
  //     })();
  //   } else {
  //     setConnect({ connectState: 'close' });
  //   }
  // }, [isLoggedIn]);

  return (
    // <NavigationContainer linking={LinkingConfiguration}>
    <NavigationContainer>
      {/* <Stack.Navigator headerMode='screen'> */}
      <Stack.Navigator >

        <Stack.Screen name="Welcome" component={Welcome} />
        {/* <> */}
        {/* {generateRoutes(WelcomeRoutes)} */}
        {/* {generateRoutes(LoginRoutes)} */}
        {/* {generateRoutes(RegisterStackRoutes)} */}
        {/* {generateRoutes(RecoveryStackRoutes)} */}
        {/* </> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { MainNavigator };
