import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { Service } from '../../services/entities/service.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  date: Date;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  pet: Pet;

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  service: Service;
}
