import { Animal } from '../../animals/entities/animal.entity';
import { Service } from '../../services/entities/service.entity';

export class Appointment {
  id: string;
  date: Date;
  status: string; // Status: scheduled, completed, cancelled
  notes?: string;
  animalId: string;
  animal: Animal;
  serviceId: string;
  service: Service;

  constructor(partial: Partial<Appointment>) {
    Object.assign(this, partial);
    this.date = partial.date || new Date();
  }

  isScheduled(): boolean {
    return this.status === 'scheduled';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  complete(): void {
    if (this.status === 'scheduled') {
      this.status = 'completed';
    } else {
      throw new Error('Appointment can only be completed if it is scheduled');
    }
  }

  cancel(): void {
    if (this.status === 'scheduled') {
      this.status = 'cancelled';
    } else {
      throw new Error('Appointment can only be cancelled if it is scheduled');
    }
  }

  reschedule(newDate: Date): void {
    if (this.isCancelled()) {
      throw new Error('Cannot reschedule a cancelled appointment');
    }

    if (newDate <= new Date()) {
      throw new Error('New appointment date must be in the future');
    }

    this.date = newDate;
  }

  // Determine if the appointment is upcoming (within the next 24 hours)
  isUpcoming(): boolean {
    const now = new Date();
    const diff = this.date.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);

    return this.isScheduled() && hours > 0 && hours <= 24;
  }
}
