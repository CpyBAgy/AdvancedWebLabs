import { Order } from '../../orders/entities/order.entity';
import { Contact } from '../../contacts/entities/contact.entity';

export class Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  orders?: Order[];
  contacts?: Contact[];

  constructor(partial: Partial<Customer>) {
    Object.assign(this, partial);
  }

  hasOrders(): boolean {
    return !!this.orders && this.orders.length > 0;
  }

  getOrderCount(): number {
    return this.orders?.length || 0;
  }

  getTotalSpent(): number {
    if (!this.orders || this.orders.length === 0) {
      return 0;
    }

    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  isPreferred(): boolean {
    return this.getTotalSpent() > 1000;
  }
}
