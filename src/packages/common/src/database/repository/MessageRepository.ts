import { Connection, InsertResult, Repository } from 'typeorm';

import { Messages } from '../entity/messages';

export class MessageRepository {
  private ormRepository: Repository<Messages>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(Messages);
  }

  public async getMessage(
    userA: string,
    userB: string
  ): Promise<Messages | undefined> {
    return await this.ormRepository.findOne({
      where: { userA, userB }
    });
  }

  public async getPaginatedMessages(
    skip: number,
    take: number,
    userA: string,
    userB: string
  ): Promise<{
    rows: Messages[];
    count: number;
  }> {
    const [rows, count] = await this.ormRepository.findAndCount({
      skip,
      take,
      where: { userA, userB },
      order: { id: 'DESC' }
    });

    return {
      rows,
      count
    };
  }

  public async createMessages(message: Messages[]): Promise<InsertResult> {
    return this.ormRepository.insert(message);
  }
}
