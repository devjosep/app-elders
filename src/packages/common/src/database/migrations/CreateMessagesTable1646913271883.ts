import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessagesTable1646913271883 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create table if not exists messages (
      id integer primary key autoincrement,
      userA text not null,
      userB text not null,
      message text not null,
      sender text not null,
      date int,
      messageId string unique
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('messages');
  }
}
