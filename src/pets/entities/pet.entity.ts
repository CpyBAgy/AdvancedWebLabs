import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // например, "собака", "кошка"

  @ManyToOne(() => User, (users) => users.pets, { onDelete: 'CASCADE' })
  owner: User;
}
