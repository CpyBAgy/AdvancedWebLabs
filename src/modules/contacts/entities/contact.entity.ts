import { Customer } from '../../customers/entities/customer.entity';

export class Contact {
  id: string;
  email?: string;
  phone?: string;
  type: string; // Type of contact: primary, work, emergency, etc.
  customer: Customer;
  customerId: string;

  constructor(partial: Partial<Contact>) {
    Object.assign(this, partial);
  }

  isPrimary(): boolean {
    return this.type === 'primary';
  }

  isEmergency(): boolean {
    return this.type === 'emergency';
  }

  hasEmail(): boolean {
    return !!this.email && this.email.trim().length > 0;
  }

  hasPhone(): boolean {
    return !!this.phone && this.phone.trim().length > 0;
  }

  isValid(): boolean {
    return this.hasEmail() || this.hasPhone();
  }
} 