import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

import Modal from 'react-native-modal';

import {
  formattedTime,
  formmatedTimeA11Y,
  useAccessibilityAutoFocus,
  useAppStateActions,
  useAudioContext,
  useRecord
} from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { CustomBackdropModal } from './CustomBackdropModal';
import { AudioPlayer } from './record-preview/AudioPlayer';
import Microphone from 'icons/microphone.svg';
import SendIcon from 'icons/send24.svg';
import Stop from 'icons/stop.svg';
import Trash from 'icons/trash.svg';

type RecordPreviewProps = {
  onSend?: (fileUrl: string, duration: number) => void;
  disabled?: boolean;
};

const RecordPreview = ({ onSend, disabled = false }: RecordPreviewProps) => {
  const { accessibility } = useAccessibilityAutoFocus();

  const {
    fileUrl: audioFileUrl,
    isPlaying,
    setFileUrl,
    pause
  } = useAudioContext();

  const [waitSend, setWaitSend] = useState(false);

  const isRemoving = useRef(false);

  const { theme, constants } = useTheme();

  const stylesChat = styles({ theme, constants });

  const {
    startRecording,
    stopRecording,
    removeRecording,
    status: { isRecording, fileUrl, isDoneRecording, durationMillis = 0 }
  } = useRecord();

  useAppStateActions({
    onBackground: () => {
      stopRecord();
    }
  });

  const stopRecord = async () => {
    if (isRecording) {
      await stopRecording();
      return true;
    } else {
      return false;
    }
  };

  const handleOnClose = async () => {
    isRemoving.current = true;
    await stopRecord();
    removeRecording();
    isRemoving.current = false;
  };

  const handleOnSend = async () => {
    onSend?.(fileUrl!, durationMillis);
  };

  const send = async () => {
    const waitStop = await stopRecord();

    if (waitStop) {
      setWaitSend(true);
    } else {
      handleOnSend();
    }
  };

  useEffect(() => {
    if (fileUrl && waitSend) {
      handleOnSend();
    }
  }, [fileUrl, waitSend]);

  useEffect(() => {
    return () => {
      if (isPlaying && fileUrl === audioFileUrl) {
        pause();
        setFileUrl(undefined, 0);
      }
    };
  }, [isPlaying, fileUrl, audioFileUrl]);

  return (
    <>
      <TouchableOpacity
        {...accessibility(
          {
            label: 'Enviar mensaje de voz',
            role: 'button',
            state: { disabled }
          },
          { accessible: true }
        )}
        onPress={() => (isRecording ? stopRecording() : startRecording())}
      >
        <View
          style={[stylesChat.microphoneButton, stylesChat.actionButtonEnabled]}
        >
          <Microphone height={32} width={32} />
        </View>
      </TouchableOpacity>

      <Modal
        isVisible={isRecording !== undefined}
        accessibilityViewIsModal
        useNativeDriver
        customBackdrop={<CustomBackdropModal />}
        onSwipeComplete={handleOnClose}
        style={stylesChat.modal}
      >
        <View style={stylesChat.recordPreviewContent}>
          <View style={stylesChat.recordPreviewHeader}>
            {isRemoving.current ? (
              <Text
                {...accessibility(
                  {
                    label: 'Eliminando mensaje de voz',
                    role: 'text',
                    state: { disabled }
                  },
                  { accessible: true }
                )}
                style={stylesChat.durationText}
              >
                Eliminando...
              </Text>
            ) : (
              isRecording && (
                <Text
                  {...accessibility(
                    {
                      label: formmatedTimeA11Y(durationMillis),
                      role: 'text',
                      state: { disabled }
                    },
                    { accessible: true }
                  )}
                  style={stylesChat.durationText}
                >
                  {formattedTime(durationMillis)}
                </Text>
              )
            )}
            {fileUrl && isDoneRecording ? (
              <AudioPlayer
                fileUrl={fileUrl}
                autoPlay={false}
                durationMillis={durationMillis}
              />
            ) : null}
          </View>
          <View style={stylesChat.controlButtons}>
            <TouchableOpacity
              {...accessibility(
                {
                  label: 'Eliminar mensaje de voz',
                  role: 'button',
                  state: { disabled }
                },
                { accessible: true }
              )}
              style={stylesChat.trashButton}
              onPress={handleOnClose}
            >
              <Trash height={32} width={32} />
            </TouchableOpacity>
            {isRecording && (
              <TouchableOpacity
                {...accessibility(
                  {
                    label: 'Parar mensaje de voz',
                    role: 'button',
                    state: { disabled }
                  },
                  { accessible: true }
                )}
                style={stylesChat.stopButton}
                onPress={stopRecording}
              >
                <Stop height={32} width={32} color={theme.error} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              {...accessibility(
                {
                  label: 'Enviar mensaje de voz',
                  role: 'button',
                  state: { disabled }
                },
                { accessible: true }
              )}
              style={stylesChat.sendButton}
              onPress={send}
            >
              <SendIcon
                height={32}
                width={32}
                color={theme.fontColorNegative}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = ({
  theme,
  constants: { FF, FS }
}: Pick<BuildStyles, 'theme' | 'constants'>) =>
  StyleSheet.create({
    microphoneButton: {
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
    modal: {
      justifyContent: 'flex-end',
      margin: 0
    },
    recordPreviewContent: {
      height: 120,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderWidth: 1,
      borderColor: '#e2e2e2',
      backgroundColor: theme.buttonSheetBg,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      paddingHorizontal: 16,
      paddingVertical: 10
    },
    recordPreviewHeader: {
      flexGrow: 1
    },
    controlButtons: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    },
    trashButton: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    stopButton: {
      width: 48,
      height: 48,
      marginLeft: 16,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: theme.error,
      justifyContent: 'center',
      alignItems: 'center'
    },
    sendButton: {
      width: 48,
      height: 48,
      borderRadius: 50,
      backgroundColor: theme.bgBtnPrimary,
      marginLeft: 16,
      justifyContent: 'center',
      alignItems: 'center'
    },
    durationText: {
      fontFamily: FF.medium,
      color: theme.fontColorBase,
      fontSize: FS.XM,
      lineHeight: 36
    }
  });

export { RecordPreview };
