import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @ManyToOne(() => User, (users) => users.contacts, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  service: Service;
}
