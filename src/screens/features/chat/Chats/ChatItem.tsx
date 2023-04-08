import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
  getDistanceString,
  Conversation,
  useChatConnectionContext,
  useAccessibilityAutoFocus
} from '@client/common';
import { ProfilePicture } from '@client/ui-components/src/components/ProfilePicture';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

type ChatItemProps = {
  chat: Conversation;
};

const ChatItem = memo(({ chat }: ChatItemProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();

  const navigation = useNavigation();

  const { setOnBlurAction } = useChatConnectionContext();

  const styles = buildStyles({ role, theme, constants });

  const a11yVolunteer = `Chat con voluntario: ${chat.recipientName}`;
  const a11yCollaborationType = chat.collaborationType;
  const a11yLast =
    chat.lastMessage && chat.lastMessageDate
      ? `Último mensaje: ${chat.lastMessage}. ${getDistanceString(
          chat.lastMessageDate
        )}`
      : 'Sin mensajes';

  return (
    <TouchableOpacity
      {...accessibility(
        {
          label: `${a11yVolunteer} para ${a11yCollaborationType}. ${a11yLast}`,
          hint: 'Ir al chat',
          role: 'button'
        },
        { accessible: true }
      )}
      onPress={() => {
        setOnBlurAction(false);
        navigation.navigate('ChatSession', {
          destinationUserId: chat.recipientCid360,
          collaborationType: chat.collaborationType
        });
      }}
    >
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <ProfilePicture
            user={chat.recipientName}
            width={72}
            height={72}
            isBase64Picture
            pictureUrl={chat.recipientPicture}
          />
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.user}>{chat.recipientName}</Text>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.date}>
                {chat.lastMessage
                  ? getDistanceString(chat.lastMessageDate!)
                  : ''}
              </Text>
            </View>
            <Text style={styles.collaboration}>
              para{' '}
              <Text style={styles.collaborationHighlighted}>
                {chat.collaborationType}
              </Text>
            </Text>
            <View style={styles.messageContainer}>
              <Text
                style={styles.message}
                numberOfLines={2}
                lineBreakMode='tail'
              >
                {chat.lastMessage}
              </Text>
              {chat.pendingToRead > 0 ? (
                <View style={styles.messagesPendingToRead}>
                  <Text style={styles.messagesPendingToReadText}>
                    {chat.pendingToRead}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const buildStyles = ({ role, theme, constants: { FS, FF } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      position: 'relative',
      backgroundColor: role === 'elders' ? theme.bgSecondary : theme.bgDefault
    },
    titleContainer: {
      flexDirection: 'row'
    },
    content: {
      flex: 1,
      flexDirection: 'column',
      paddingLeft: 12
    },
    user: {
      flex: 1,
      fontFamily: FF.semiBold,
      fontSize: FS.L,
      lineHeight: 24,
      color: theme.fontColorBase
    },
    collaboration: {
      flex: 1,
      fontFamily: FF.regular,
      fontSize: FS.M,
      lineHeight: 24,
      color: theme.fontColorBase,
      paddingBottom: role === 'elders' ? 4 : 0
    },
    collaborationHighlighted: {
      fontFamily: FF.semiBold
    },
    messageContainer: {
      flex: 1,
      flexDirection: 'row'
    },
    message: {
      flex: 1,
      fontFamily: FF.italic,
      fontSize: FS.M,
      lineHeight: 24,
      color: theme.fontColorBase
    },
    messagesPendingToRead: {
      marginLeft: 3,
      borderWidth: 2,
      borderColor: '#DA1C5C',
      borderRadius: 50,
      backgroundColor: '#DA1C5C',
      paddingHorizontal: 7,
      paddingVertical: 5,
      height: 30,
      minWidth: 30,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center'
    },
    messagesPendingToReadText: {
      fontFamily: 'Poppins SemiBold',
      fontSize: 14,
      lineHeight: 21,
      color: '#FFFFFF'
    },
    date: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.M,
      lineHeight: 24
    }
  });

export { ChatItem };
