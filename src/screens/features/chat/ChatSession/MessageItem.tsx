import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { useQuery } from 'react-query';

import {
  dateToString,
  dateToTimeString,
  downloadAttachment,
  DownloadAttachmentResponse,
  Message,
  MessageType,
  useAccessibilityAutoFocus
} from '@client/common';
import { AudioPlayer } from '@client/ui-components/src/components';
import { RADIUS, Z_INDEX } from '@client/ui-components/src/theme/global';
import { useTheme } from '@client/ui-components/src/utils/useTheme';

import ChatArrowIcon from '../../../../assets/icons/chatArrow.svg';

type PrintDateType = {
  date: Date | undefined;
  print: boolean;
  last: boolean;
};

type MessageItemProps = {
  message: Message;
  currentUserId: string;
  printDate: PrintDateType;
};

const ATTACHMENT_QUERY_KEY = 'attachment';

const MessageItem = ({
  message,
  currentUserId,
  printDate
}: MessageItemProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();

  const styles = buildStyles({ role, theme, constants, printDate });

  const messageType = message.sender === currentUserId ? 'enviado' : 'recibido';

  const isMyMessage = message.sender === currentUserId;

  const time = dateToTimeString(message.date, 'HH:mm');

  const {
    data: attachmentUrlDownloaded,
    isLoading: downloading,
    refetch
  } = useQuery<DownloadAttachmentResponse>(
    [ATTACHMENT_QUERY_KEY, message.id],
    () => downloadAttachment(message.attachmentUrl ?? ''),
    {
      suspense: false,
      enabled: false,
      cacheTime: 0
    }
  );

  return (
    <>
      <View
        {...accessibility(
          {
            label: `Mensaje ${messageType}: ${message.message}. ${time}`,
            role: 'text'
          },
          { accessible: true }
        )}
        style={[styles.container, isMyMessage && styles.containerCurrentUser]}
      >
        <View style={[styles.bubble, isMyMessage && styles.bubbleCurrentUser]}>
          {message.attachmentType === MessageType.AUDIO ? (
           <Text
           style={[
             styles.messageText,
             isMyMessage && styles.messageTextCurrentUser
           ]}
         >
           {"Este audio no se puede reproducir en este dispositivo."}
         </Text>
          ) : (
            <Text
              style={[
                styles.messageText,
                isMyMessage && styles.messageTextCurrentUser
              ]}
            >
              {message.message}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.arrowContainer,
            isMyMessage ? styles.arrowRightContainer : styles.arrowLeftContainer
          ]}
        >
          <ChatArrowIcon
            width={8}
            height={16}
            style={
              [isMyMessage ? styles.arrowRight : styles.arrowLeft] as never
            }
          />
        </View>
        <View
          style={[
            styles.messageTime,
            isMyMessage && styles.messageTimeCurrentUser
          ]}
        >
          <Text style={styles.messageTimeContent}>
            {dateToTimeString(message.date, 'HH:mm')}
          </Text>
        </View>
      </View>
      {printDate.print && printDate.date ? (
        <View
          {...accessibility(
            {
              label: `Grupo de mensajes del día ${dateToString(
                printDate.date,
                "dd 'de' MMMM 'de' yyyy"
              )}`,
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.viewChangeDate}
        >
          <Text style={styles.textChangeDate}>
            {dateToString(printDate.date, "dd 'de' MMMM 'de' yyyy")}
          </Text>
        </View>
      ) : null}
    </>
  );
};

export { MessageItem };

const buildStyles = ({ role, theme, constants: { FF, FS }, printDate }: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginTop: printDate.print ? 0 : 4,
      marginBottom: printDate.print ? 0 : role === 'elders' ? 16 : 12,
      transform: [{ scaleY: -1 }]
    },
    containerCurrentUser: {
      flexDirection: 'column',
      alignItems: 'flex-end'
    },
    bubble: {
      width: '90%',
      backgroundColor: theme.bgChatMsg,
      borderRadius: 4,
      paddingVertical: 4,
      paddingLeft: 12,
      paddingRight: 20,
      marginHorizontal: 8,
      zIndex: Z_INDEX.overDefault
    },
    bubbleCurrentUser: {
      backgroundColor: theme.bgChatCurrentMsg
    },
    messageText: {
      fontSize: role === 'elders' ? FS.XM : FS.S,
      lineHeight: 24,
      fontFamily: FF.regular,
      letterSpacing: role === 'elders' ? 0.3 : 0,
      color: theme.fontColorBase
    },
    messageTextCurrentUser: {
      color: theme.fontColorNegative
    },
    arrowContainer: {
      position: 'absolute',
      top: 8,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1
    },
    arrowLeftContainer: {
      alignItems: 'flex-start'
    },
    arrowRightContainer: {
      alignItems: 'flex-end'
    },
    arrowLeft: {
      transform: [{ rotate: '180deg' }],
      color: theme.bgChatMsg
    },
    arrowRight: { color: theme.bgChatCurrentMsg },
    messageTime: { marginTop: 4, marginLeft: 8 },
    messageTimeCurrentUser: {
      alignItems: 'flex-end',
      marginLeft: 0,
      marginRight: 8
    },
    messageTimeContent: {
      fontFamily: FF.regular,
      fontSize: role === 'elders' ? FS.M : FS.XS,
      lineHeight: 20,
      color: theme.fontColorAux
    },
    viewChangeDate: {
      transform: [{ scaleY: -1 }],
      marginTop: 20,
      marginBottom: printDate.last ? 24 : 0,
      alignSelf: 'center',
      backgroundColor: theme.backgroundDateChat,
      borderRadius: RADIUS.L,
      padding: 10
    },
    textChangeDate: {
      fontSize: FS.S,
      fontFamily: FF.regular,
      color: theme.fontColorNegative
    }
  });
