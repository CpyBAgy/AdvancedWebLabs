import { Animal } from '../../animals/entities/animal.entity';

export class Category {
  id: string;
  name: string;
  description?: string;
  animals?: Animal[];

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }

  get animalCount(): number {
    return this.animals?.length || 0;
  }

  hasAnimals(): boolean {
    return this.animalCount > 0;
  }
}
