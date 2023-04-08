import { Connection, createConnection } from 'typeorm';

import { Conversations } from './entity/conversations';
import { Messages } from './entity/messages';
import {
  CreateConversationsTable1646913271883,
  CreateMessagesTable1646913271883
} from './migrations';
import { AddAttachmentToMessageTable1647344198029 } from './migrations/AddAttachmentToMessageTable1647344198029';
import { ConversationRepository } from './repository/ConversationRepository';
import { MessageRepository } from './repository/MessageRepository';

const createDatabaseConnection = () => {
  let connection: Connection | null = null;
  let conversationRepository: ConversationRepository | null = null;
  let messageRepository: MessageRepository | null = null;

  const connect = async (databaseName: string): Promise<void> => {
    console.info(`Creando conexión con base de datos ${databaseName}...`);
    try {
      const connectionCreated = await createConnection({
        type: 'expo',
        database: databaseName,
        name: `ddbb_${databaseName}+${Date.now()}`,
        driver: require('expo-sqlite'),
        entities: [Conversations, Messages],

        migrations: [
          CreateConversationsTable1646913271883,
          CreateMessagesTable1646913271883,
          AddAttachmentToMessageTable1647344198029
        ],
        migrationsRun: true,

        synchronize: false,
        logger: 'debug'
      });

      const newConversationRepository = new ConversationRepository(
        connectionCreated
      );

      const newMessageRepository = new MessageRepository(connectionCreated);

      connection = connectionCreated;
      conversationRepository = newConversationRepository;
      messageRepository = newMessageRepository;
      console.info('Conexión creada');
    } catch (error) {
      console.info(error);
    }
  };

  const close = async (): Promise<void> => {
    if (connection) {
      console.info('Cerrando conexión con base de datos...');
      await connection.close();
      console.info('Conexión cerrada');
    }
  };

  const getIsConnected = (): boolean => {
    return connection?.isConnected ?? false;
  };

  const getConnection = (): Connection | null => {
    return connection;
  };

  const getConversationRepository = (): ConversationRepository | null => {
    return conversationRepository;
  };

  const getMessageRepository = (): MessageRepository | null => {
    return messageRepository;
  };

  return {
    connect,
    close,
    getIsConnected,
    getConnection,
    getConversationRepository,
    getMessageRepository
  };
};

export { createDatabaseConnection };
