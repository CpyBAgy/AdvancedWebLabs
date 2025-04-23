import { Category } from '../../categories/entities/category.entity';
import { Order } from '../../orders/entities/order.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

export class Animal {
  id: string;
  name: string;
  species: string;
  price: number;
  age?: number;
  gender?: string;
  description?: string;
  status: string;
  categoryId: string;
  category?: Category;
  orders?: Order[];
  appointments?: Appointment[];

  constructor(partial: Partial<Animal>) {
    Object.assign(this, partial);
  }

  isAvailable(): boolean {
    return this.status === 'available';
  }

  reserve(): void {
    if (this.status === 'available') {
      this.status = 'reserved';
    } else {
      throw new Error('Animal is not available');
    }
  }

  sell(): void {
    if (this.status === 'available' || this.status === 'reserved') {
      this.status = 'sold';
    } else {
      throw new Error('Animal cannot be sold');
    }
  }
} 