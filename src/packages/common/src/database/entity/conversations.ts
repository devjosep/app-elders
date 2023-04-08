import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('conversations')
export class Conversations {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column('text', { nullable: true })
  collaborationType?: string;

  @Column({ nullable: true })
  status?: number;

  @Column({ nullable: true })
  lastMessage?: string;

  @Column({ nullable: true })
  lastMessageDate?: number;

  @Column()
  recipientName?: string;

  @Column()
  recipientCid360: string;

  @Column({ nullable: true })
  recipientPicture?: string;

  @Column()
  pendingToRead?: number;
}
