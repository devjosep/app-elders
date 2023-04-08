import React, { Suspense, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  View,
  TouchableOpacity,
  Platform,
  Text
} from 'react-native';

import { RouteProp, useRoute } from '@react-navigation/native';

import {
  isDateEqual,
  Message,
  useAccessibilityAutoFocus,
  useChatSession,
  useAuth,
  UserType,
  MessageType,
  AudioProvider
// } from '../../../utils/common';
} from '@client/common';
// import { useGetActiveCollaborationsQuery } from '@client/common/src/chat/conversations/useGetActiveCollaborations';
// import { RecordPreview } from '../../../components';
import { Loading } from '../../../components';
// import { Loading } from '@client/ui-components/src/components/Loading';
import { TextArea } from '../../../components/TextArea';
import { BuildStyles } from '../../../utils';
import { useTheme } from '../../../utils';

import { MessageItem } from './ChatSession/MessageItem';
import { RouteParams } from './routes';
// import SendIcon from 'icons/send24.svg';

type ChatSessionInnerProps = {
  destinationUserId: string;
  collaborationType: string;
};

const TIMEOUT_FIX_ORIENTATION_ACCESSIBILITY = 4000;

const ChatSessionInner = ({
  destinationUserId,
  collaborationType
}: ChatSessionInnerProps) => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();
  const { cid360 } = useAuth((s) => s.user);
  const { theme, constants } = useTheme();

  const stylesChat = styles({ theme, constants });

  // const { data: activeCollaborations } = useGetActiveCollaborationsQuery(
  //   UserType.ELDER
  // );

  // const disabled = useMemo(
  //   () => !activeCollaborations?.includes(destinationUserId) ?? false,
  //   [activeCollaborations]
  // );

  const {
    handleSendMessage,
    isSending,
    message,
    isMessageEmpty,
    handleSetMessage,
    data,
    fetchMore,
    canFetchMore,
    sentOk
  } = useChatSession(destinationUserId, collaborationType);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        announceForAccessibility(
          'Importante. El desplazamiento por el listado de mensajes está invertido'
        );
      }, TIMEOUT_FIX_ORIENTATION_ACCESSIBILITY);
    }
  }, []);

  useEffect(() => {
    if (isSending) {
      announceForAccessibility('Enviando mensaje');
    }

    if (sentOk) {
      announceForAccessibility('Mensaje enviado');
    }
  }, [isSending, sentOk]);

  return (
    <AudioProvider>
      <View style={stylesChat.chatContainer}>
        <FlatList
          style={stylesChat.listContainer}
          data={data}
          renderItem={({ item, index }: ListRenderItemInfo<Message>) => {
            const printDate =
              data && index < data.length
                ? index === data.length - 1
                  ? true
                  : !isDateEqual(data[index + 1].date, item.date)
                : false;

            return (
              <MessageItem
                message={item}
                currentUserId={cid360}
                printDate={{
                  print: printDate,
                  date: data && printDate ? data[index].date : undefined,
                  last: data !== undefined && index === data.length - 1
                }}
              />
            );
          }}
          keyExtractor={(_item, index) => index.toString()}
          onEndReached={({ distanceFromEnd }) =>
            distanceFromEnd > 0 && canFetchMore && fetchMore()
          }
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />

        <View style={stylesChat.actionContainer}>
          {/* {disabled ? ( */}
          {true ? (
            <Text
              style={stylesChat.chatDisabled}
              {...accessibility(
                {
                  label:
                    'No puedes enviar mensajes a este voluntario porque no tienes colaboraciones activas con él'
                },
                { accessible: true }
              )}
            >
              No puedes enviar mensajes a este voluntario porque no tienes
              colaboraciones activas con él
            </Text>
          ) : (
            <>
              <TextArea
                style={stylesChat.message}
                {...accessibility({}, { autoFocus: true })}
                placeholder='Escribe un mensaje'
                multiline
                maxHeight={150}
                maxLength={1000}
                value={message}
                onChangeText={handleSetMessage}
                // disabled={disabled}
                disabled={true}
              />
              {isSending ? (
                <View style={stylesChat.loader}>
                  <Loading />
                </View>
              )  : (
                <TouchableOpacity
                  {...accessibility(
                    {
                      label: 'Enviar mensaje',
                      hint: 'Enviar mensaje al voluntario',
                      role: 'button',
                      state: {
                        // disabled: isMessageEmpty || isSending || disabled
                        disabled: isMessageEmpty || isSending || true 
                      }
                    },
                    { accessible: true }
                  )}
                  // disabled={isMessageEmpty || isSending || disabled}
                  disabled={isMessageEmpty || isSending || true}
                  onPress={() => {
                    // if (!isMessageEmpty && !isSending && !disabled) {
                    if (!isMessageEmpty && !isSending && !true) {
                      handleSendMessage({ attachmentInfo: undefined });
                    }
                  }}
                >
                  <View
                    style={[
                      stylesChat.actionButton,
                      isMessageEmpty || isSending
                        ? stylesChat.actionButtonDisabled
                        : stylesChat.actionButtonEnabled
                    ]}
                  >
                    {/* <SendIcon
                      height={32}
                      width={32}
                      style={stylesChat.actionIcon as never}
                    /> */}
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </AudioProvider>
  );
};

const ChatSession_ = () => {
  const {
    params: { collaborationType, destinationUserId }
  } = useRoute<RouteProp<RouteParams, 'ChatSession'>>();

  return (
    <Suspense fallback={<Loading />}>
      <ChatSessionInner
        destinationUserId={destinationUserId.toString().split('.')[0]}
        collaborationType={collaborationType.toString().split('.')[0]}
      />
    </Suspense>
  );
};

const  ChatSession =()=> <View><Text>dsadas</Text> </View>

export default ChatSession;

const styles = ({
  theme,
  constants: { FS }
}: Pick<BuildStyles, 'theme' | 'constants'>) =>
  StyleSheet.create({
    chatContainer: {
      flex: 1,
      backgroundColor: theme.bgDefault
    },
    listContainer: {
      paddingHorizontal: 8,
      transform: [{ scaleY: -1 }]
    },
    actionContainer: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: theme.bgSecondary
    },
    message: { flex: 1, flexGrow: 1 },
    loader: {
      width: 52,
      height: 52,
      marginLeft: 16,
      justifyContent: 'center',
      alignItems: 'center'
    },
    actionButton: {
      width: 52,
      height: 52,
      borderRadius: 50,
      backgroundColor: theme.bgBtnPrimary,
      marginLeft: 16,
      justifyContent: 'center',
      alignItems: 'center'
    },
    actionButtonEnabled: {
      backgroundColor: theme.bgBtnPrimary
    },
    actionButtonDisabled: {
      backgroundColor: theme.buttonSendDisabled
    },
    actionIcon: {
      color: theme.fontColorNegative
    },
    chatDisabled: {
      color: theme.fontColorBase,
      fontSize: FS.XM,
      lineHeight: 28
    }
  });
