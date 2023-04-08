import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttachmentToMessageTable1647344198029
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE messages ADD COLUMN attachmentType integer`
    );
    await queryRunner.query(
      `ALTER TABLE messages ADD COLUMN attachmentSize integer`
    );
    await queryRunner.query(
      `ALTER TABLE messages ADD COLUMN attachmentUrl text`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE messages DROP COLUMN attachmentType`);
    await queryRunner.query(`ALTER TABLE messages DROP COLUMN attachmentSize`);
    await queryRunner.query(`ALTER TABLE messages DROP COLUMN attachmentUrl`);
  }
}
