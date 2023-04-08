import { useEffect, useRef, useState } from 'react';

import {
  HubConnectionBuilder,
  IHttpConnectionOptions,
  HubConnection,
  LogLevel
} from '@microsoft/signalr';

import { useWrapperRef } from '../../utils/useWrapperRef';

const reconnectionTimes = [0, 100, 250, 500, 1000, 2500];
const retryMesssageTimes = [500, 1000, 2000, 5000];
const MAX_RETRY_MESSAGE_COUNT = retryMesssageTimes.length - 1;

const createConnection = (
  url: string,
  options: IHttpConnectionOptions = {}
): HubConnection =>
  new HubConnectionBuilder()
    .withUrl(url, options)
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retry) =>
        reconnectionTimes[
          Math.min(retry.previousRetryCount, reconnectionTimes.length - 1)
        ]
    })
    .configureLogging(LogLevel.Warning)
    .build();

type CallbackMethods = 'ReceiveMessage' | 'ReceivePendingMessage';

type ReceiveFunction<T> = (...args: T[]) => Promise<void> | void;

export type ConnectionState = 'close' | 'connect';

const useSignalR = <T>(
  url: string,
  receiveMethodName: CallbackMethods,
  onReceiveAction: ReceiveFunction<T>,
  receiveMissingName: CallbackMethods,
  onReceiveMissingAction: ReceiveFunction<T[]>,
  options: IHttpConnectionOptions = {},
  connection: ConnectionState | undefined
) => {
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<HubConnection>();

  const onReceiveActionRef = useWrapperRef(onReceiveAction);
  const onReceiveMissingActionRef = useWrapperRef(onReceiveMissingAction);

  const [connectionState, setConnectionState] = useState<
    ConnectionState | undefined
  >(undefined);
  const lastConnectionState = useRef<ConnectionState>();
  const [hasError, setHasError] = useState<boolean>(false);

  const createConnectionAndStart = async (): Promise<boolean> => {
    console.info('creating SignalR connection...');

    if (
      connectionRef.current?.state === 'Connected' ||
      connectionRef.current?.state === 'Connecting'
    ) {
      return true;
    }

    return (
      connectionRef.current
        ?.start()
        .then(() => {
          setIsConnected(true);
          console.info('started SignalR connection');
          console.info('State', connectionRef.current?.state);
          return true;
        })
        .catch((err) => {
          setIsConnected(false);
          const error = err.toString() as string;
          console.error(err);
          if (
            !error.includes('negotiation') &&
            !error.includes('start') &&
            !error.includes('before')
          ) {
            setHasError(true);
          }

          return false;
        }) ?? false
    );
  };

  const stopConnection = async (): Promise<void> => {
    if (
      connectionRef.current?.state === 'Disconnected' ||
      connectionRef.current?.state === 'Disconnecting'
    ) {
      return;
    }

    await connectionRef.current
      ?.stop()
      .then(() => {
        console.info('stopped SignalR connection');
        console.info('State', connectionRef.current?.state);
      })
      .catch((err) => {
        const error = err.toString() as string;
        console.error(err);
        if (
          !error.includes('negotiation') &&
          !error.includes('start') &&
          !error.includes('before')
        ) {
          setHasError(true);
        }
      })
      .finally(() => {
        connectionRef.current?.off(receiveMethodName);
        connectionRef.current?.off(receiveMissingName);
        setIsConnected(false);
      });
  };

  const reconnect = async (): Promise<boolean> => {
    await stopConnection();
    return await createConnectionAndStart();
  };

  const sendImmediate = async (methodName: string, ...args: unknown[]) => {
    await connectionRef.current?.invoke(methodName, ...args);
  };

  const sendWithRetry = async (
    retry: number,
    methodName: string,
    ...args: unknown[]
  ): Promise<void> => {
    if (retry <= 0) {
      throw new Error('retry count exceeded');
    }

    if (connectionRef.current?.state === 'Connected') {
      return await connectionRef.current?.invoke(methodName, ...args);
    }

    if (
      !connectionRef.current ||
      connectionRef.current?.state === 'Disconnected'
    ) {
      if (await reconnect()) {
        return await connectionRef.current?.invoke(methodName, ...args);
      }
    }

    if (
      connectionRef.current?.state === 'Connecting' ||
      connectionRef.current?.state === 'Reconnecting' ||
      connectionRef.current?.state === 'Disconnecting'
    ) {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            resolve(await sendWithRetry(retry - 1, methodName, ...args));
          } catch (err) {
            reject(err);
          }
        }, retryMesssageTimes[retry]);
      });
    }
  };

  const send = async (
    methodName: string,
    ...args: unknown[]
  ): Promise<void> => {
    await sendWithRetry(MAX_RETRY_MESSAGE_COUNT, methodName, ...args);
  };

  useEffect(() => {
    if (lastConnectionState.current !== connectionState) {
      if (connectionState === 'close') {
        stopConnection();
      } else if (connectionState === 'connect') {
        createConnectionAndStart();
      }
    }

    lastConnectionState.current = connectionState;
  }, [connectionState]);

  useEffect(() => {
    if (connection === 'connect') {
      connectionRef.current = createConnection(url, options);
      connectionRef.current.on(receiveMethodName, onReceiveActionRef.current);
      connectionRef.current.on(
        receiveMissingName,
        onReceiveMissingActionRef.current
      );
      connectionRef.current.onclose(async (error) => {
        if (error) {
          const canReconnect = await reconnect();
          if (!canReconnect) {
            setHasError(true);
          }
        }
      });

      setConnectionState('connect');
    } else if (connection === 'close') {
      setConnectionState('close');
    }
  }, [connection]);

  return { send, isConnected, sendImmediate, hasError };
};

export { useSignalR };
