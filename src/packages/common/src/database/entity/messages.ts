import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Messages {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  userA: string;

  @Column()
  userB: string;

  @Column()
  message: string;

  @Column()
  sender: string;

  @Column({ nullable: true })
  date: number;

  @Column({ unique: true })
  messageId: string;

  @Column({ nullable: true })
  attachmentType?: number;

  @Column({ nullable: true })
  attachmentSize?: number;

  @Column({ nullable: true })
  attachmentUrl?: string;
}
