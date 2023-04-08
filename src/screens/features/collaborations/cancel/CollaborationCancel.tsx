import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from 'react-query';

import { useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Loading } from '@client/ui-components/src/components';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from '../routes';
import { CollaborationCancelForm } from './CollaborationCancel/CollaborationCancelForm';
import { CancelService } from './domain';
import { cancelService } from './service';

const CollaborationCancel = () => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const user = useAuth((state) => state.user);

  const navigation = useNavigation();

  const {
    params: { collaborationId, expiredCollaboration }
  } = useRoute<RouteProp<RouteParams, 'CollaborationCancel'>>();

  const {
    mutateAsync: collaborationCancel,
    isLoading,
    isError
  } = useMutation(cancelService, {
    onSuccess: () =>
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Home', params: { screen: 'Collaborations' } },
            {
              name: 'CollaborationCancelConfirm',
              params: { expiredCollaboration }
            }
          ]
        })
      )
  });

  const handleOnSubmit = (data: CancelService) =>
    collaborationCancel({
      reason: data.noComment ? undefined : data.message,
      id: collaborationId
    });

  useEffect(() => {
    isLoading &&
      announceForAccessibility('Cancelando la petición de colaboración');
  }, [isLoading]);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.container}
    >
      <Text
        {...accessibility(
          {
            label: `Por favor ${user.name}, indícanos por qué motivo quieres cancelar la petición:`,
            role: 'text'
          },
          { accessible: true }
        )}
        style={styles.caption}
      >
        {`Por favor ${user.name}, indícanos por qué motivo quieres cancelar la petición:`}
      </Text>
      <View style={styles.form}>
        {isLoading ? (
          <Loading />
        ) : (
          <CollaborationCancelForm
            isActionDisabled={isLoading}
            isError={isError}
            onSubmit={handleOnSubmit}
          />
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CollaborationCancel;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: theme.bgSecondary
    },
    caption: {
      flex: 0.19,
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.XM,
      letterSpacing: 0.3
    },
    form: {
      flex: 0.81
    }
  });
