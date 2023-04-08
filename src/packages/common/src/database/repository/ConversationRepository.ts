import { Connection, Repository, UpdateResult } from 'typeorm';

import { Conversations } from '../entity/conversations';

export class ConversationRepository {
  private ormRepository: Repository<Conversations>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(Conversations);
  }

  public async getConversation(
    cid360: string
  ): Promise<Conversations | undefined> {
    return await this.ormRepository.findOne({
      where: { recipientCid360: cid360 }
    });
  }

  public async getPaginatedConversations(
    skip: number,
    take: number
  ): Promise<{
    rows: Conversations[];
    count: number;
  }> {
    const [rows, count] = await this.ormRepository.findAndCount({
      skip,
      take,
      order: { lastMessageDate: 'DESC' }
    });

    return {
      rows,
      count
    };
  }

  public async createConversations(
    conversation: Conversations
  ): Promise<Conversations> {
    return this.ormRepository.save(conversation);
  }

  public async updateConversations(
    conversation: Conversations
  ): Promise<UpdateResult> {
    return this.ormRepository.update(
      { recipientCid360: conversation.recipientCid360 },
      conversation
    );
  }
}
