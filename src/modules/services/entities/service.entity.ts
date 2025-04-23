import { Appointment } from '../../appointments/entities/appointment.entity';
import { Order } from '../../orders/entities/order.entity';

export class Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number; // Duration in minutes
  type: string; // Type of service: veterinary, consultation, delivery, etc.
  appointments?: Appointment[];
  orders?: Order[];

  constructor(partial: Partial<Service>) {
    Object.assign(this, partial);
  }

  isVeterinary(): boolean {
    return this.type === 'veterinary';
  }

  isConsultation(): boolean {
    return this.type === 'consultation';
  }

  isDelivery(): boolean {
    return this.type === 'delivery';
  }

  getPriceWithDiscount(discountPercent: number): number {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    return this.price * (1 - discountPercent / 100);
  }

  getHourlyRate(): number | null {
    if (!this.duration || this.duration <= 0) {
      return null;
    }

    return (this.price / this.duration) * 60;
  }
}
