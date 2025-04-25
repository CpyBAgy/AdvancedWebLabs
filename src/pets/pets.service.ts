import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Observable, Subject } from 'rxjs';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetDto } from './dto/update-pet.dto';
import { CreatePetDto } from './dto/create-pet.dto';

@Injectable()
export class PetsService {
  private eventSubject = new Subject<MessageEvent>();

  constructor(private readonly prisma: PrismaService) {}

  async findByOwnerId(ownerId: string) {
    return this.prisma.pet.findMany({ where: { ownerId } });
  }

  async findAll(userId?: string) {
    if (userId) {
      return this.prisma.pet.findMany({ where: { ownerId: userId } });
    }
    return this.prisma.pet.findMany();
  }

  async findOne(id: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException('Животное не найдено');
    }
    return pet;
  }

  async create(input: CreatePetInput) {
    const newPet = await this.prisma.pet.create({
      data: {
        name: input.name,
        type: input.type,
        ownerId: input.ownerId,
      },
    });
    return newPet;
  }

  async update(id: string, dto: UpdatePetDto) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException('Животное не найдено');
    }
    return this.prisma.pet.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException('Животное не найдено');
    }
    const deletedPet = await this.prisma.pet.delete({ where: { id } });
    this.eventSubject.next(
      new MessageEvent('pet', { data: { action: 'deleted', pet: deletedPet } }),
    );
    return deletedPet;
  }

  getSseEvents(): Observable<MessageEvent> {
    return this.eventSubject.asObservable();
  }

  async findAllPaginated(page: number, limit: number) {
    const data = await this.prisma.pet.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.prisma.pet.count();

    return {
      data,
      total,
      page,
      next:
        total > page * limit
          ? `/api/pets?page=${page + 1}&limit=${limit}`
          : null,
      prev: page > 1 ? `/api/pets?page=${page - 1}&limit=${limit}` : null,
    };
  }
}
