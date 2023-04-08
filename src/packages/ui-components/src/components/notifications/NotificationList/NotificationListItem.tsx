import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';

import {
  dateToTimeString,
  Notification,
  NotificationType,
  RatingForm,
  RatingFormModel,
  useAccessibilityAutoFocus,
  useRatingMutation,
  useReadNotificationMutation
} from '@client/common';

import { getRgbaStrFromHexColor } from '../../../theme/colors';
import { BuildStyles, useTheme } from '../../../utils';

type NotificationListItemProps = {
  notification: Notification;
};

const NotificationListItem = ({
  notification: { id, title, description, createdAt, isRead, type, serviceId }
}: NotificationListItemProps) => {
  const { accessibility } = useAccessibilityAutoFocus();

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const { mutateAsync } = useReadNotificationMutation();

  const { mutateAsync: handleSendRating } = useRatingMutation();

  const handleSubmit = (data: RatingFormModel) =>
    handleSendRating({ rate: data.rate!, id: serviceId });

  return (
    <View
      style={[
        styles.container,
        isRead ? styles.readContainer : styles.unreadContainer
      ]}
    >
      <View
        {...accessibility(
          {
            label: `Notificación ${
              !isRead ? 'no leída' : ''
            }: ${title}. ${description}. ${
              type === NotificationType.Evaluation && 'valoración ya realizada.'
            } ${dateToTimeString(new Date(createdAt), 'HH:mm')}`,
            role: 'text'
          },
          { accessible: true }
        )}
        style={styles.containerInfo}
      >
        <View style={styles.dotContainer}>
          {!isRead ? <View style={styles.dot} /> : null}
        </View>
        <View style={styles.notificationContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.date}>
              {dateToTimeString(new Date(createdAt))}
            </Text>
          </View>
          <Text style={styles.message}>{description}</Text>
          {type === NotificationType.Evaluation && (
            <Text style={styles.rate}>Valoración ya realizada</Text>
          )}
        </View>
      </View>
      {type === NotificationType.EvaluationPending && (
        <View style={styles.ratingContainer}>
          <RatingForm onSubmit={handleSubmit} />
        </View>
      )}

      {!isRead && type !== NotificationType.EvaluationPending ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => mutateAsync(id)}>
            <Text style={styles.buttonText}>Marcar como leída</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const buildStyles = ({
  role,
  theme,
  constants: { FF, FS, RADIUS }
}: BuildStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgSecondary,
      flex: 1,
      borderRadius: RADIUS.S,
      paddingVertical: 18,
      paddingHorizontal: 14
    },
    containerInfo: {
      flex: 1,
      flexDirection: 'row'
    },
    readContainer: {
      borderWidth: 1,
      borderColor: theme.divider
    },
    unreadContainer: {
      backgroundColor: getRgbaStrFromHexColor(theme.secondary, 0.08)
    },
    dotContainer: {
      alignItems: 'flex-start',
      marginTop: 8,
      width: 20
    },
    dot: {
      backgroundColor: theme.secondary,
      height: 12,
      width: 12,
      borderRadius: 6
    },
    notificationContainer: {
      flex: 1
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8
    },
    title: {
      fontSize: role === 'elders' ? FS.L : FS.M,
      fontFamily: FF.semiBold,
      lineHeight: 28,
      marginRight: 8,
      flex: 1
    },
    date: {
      fontSize: FS.S,
      fontFamily: FF.regular,
      lineHeight: 28
    },
    message: {
      fontSize: role === 'elders' ? FS.M : FS.S,
      fontFamily: FF.regular
    },
    buttonContainer: {
      marginTop: 14,
      paddingHorizontal: 14,
      justifyContent: 'center',
      alignItems: 'baseline'
    },
    buttonText: {
      color: theme.primary,
      fontSize: role === 'elders' ? FS.M : FS.S,
      fontFamily: FF.semiBold
    },
    ratingContainer: {
      flex: 1,
      flexDirection: 'row',
      marginTop: 14
    },
    rate: {
      fontSize: FS.XM,
      fontFamily: FF.semiBold
    }
  });

export { NotificationListItem };
