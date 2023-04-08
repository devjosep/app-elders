import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversationsTable1646913271883
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create table if not exists conversations (
        id integer primary key autoincrement,
        collaborationType text not null,
        status int,
        lastMessage text,
        lastMessageDate int,
        recipientName text not null,
        recipientCid360 text not null,
        recipientPicture text,
        pendingToRead int not null
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('conversations');
  }
}
