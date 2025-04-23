import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Observable, Subject } from 'rxjs';
import { UpdatePetDto } from './dto/update-pet.dto';
import { NotFoundException } from '@nestjs/common';
import { CreatePetInput } from './dto/create-pet.input';
/*import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';*/
@Injectable()
export class PetsService {
  private eventSubject = new Subject<MessageEvent>();

  constructor(private prisma: PrismaService,
              /*@Inject(CACHE_MANAGER) private cacheManager: Cache,*/) {}

  async findByOwnerId(ownerId: string) {
    return await this.prisma.pet.findMany({ where: { ownerId } });
  }
  async findAll(userId?: string) {
    if (userId) {
      return this.prisma.pet.findMany({
        where: { ownerId: userId },
      });
    }
    return this.prisma.pet.findMany();
  }
    /*const cacheKey = userId ? `pets_user_${userId}` : 'pets_all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('[CACHE HIT]', cacheKey);
      return cached;
    }

    console.log('[CACHE MISS]', cacheKey);
    const data = await (userId
      ? this.prisma.pet.findMany({ where: { ownerId: userId } })
      : this.prisma.pet.findMany());

    await this.cacheManager.set(cacheKey, data, 10);
    return data;
  }*/


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
    if (!pet) throw new NotFoundException('Животное не найдено');

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
