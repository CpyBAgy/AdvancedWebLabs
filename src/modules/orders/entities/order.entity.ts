import { Customer } from '../../customers/entities/customer.entity';
import { Animal } from '../../animals/entities/animal.entity';
import { Service } from '../../services/entities/service.entity';

export class Order {
  id: string;
  customerId: string;
  animalId?: string;
  customer: Customer;
  animal?: Animal;
  services?: Service[];
  date: Date;
  status: string; // pending, completed, cancelled
  total: number;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
    this.date = partial.date || new Date();
  }

  isPending(): boolean {
    return this.status === 'pending';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  complete(): void {
    if (this.status === 'pending') {
      this.status = 'completed';

      // If order includes animal, mark as sold
      if (this.animal && this.animal.isAvailable()) {
        this.animal.sell();
      }
    } else {
      throw new Error('Order can only be completed if it is pending');
    }
  }

  cancel(): void {
    if (this.status === 'pending') {
      this.status = 'cancelled';
    } else {
      throw new Error('Order can only be cancelled if it is pending');
    }
  }

  calculateTotal(): number {
    let total = 0;

    // Add animal price if present
    if (this.animal) {
      total += this.animal.price;
    }

    // Add service prices
    if (this.services && this.services.length > 0) {
      total += this.services.reduce((sum, service) => sum + service.price, 0);
    }

    return total;
  }
}
