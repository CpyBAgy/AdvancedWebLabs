import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Observable, Subject } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private eventSubject = new Subject<MessageEvent>();

  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    if (!id) {
      throw new BadRequestException('Ошибка: ID пользователя не передан!');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException(
        `Ошибка: Пользователь с ID ${id} не найден`,
      );
    }

    return user;
  }
  async findAllPaginated(page: number, limit: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      page,
      next:
        total > page * limit
          ? `/api/users?page=${page + 1}&limit=${limit}`
          : null,
      prev: page > 1 ? `/api/users?page=${page - 1}&limit=${limit}` : null,
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
      },
    });
  }

  async update(id: string, updateData: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    this.eventSubject.next(
      new MessageEvent('user', {
        data: { action: 'updated', user: updatedUser },
      }),
    );
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });

    this.eventSubject.next(
      new MessageEvent('user', {
        data: { action: 'deleted', user: deletedUser },
      }),
    );
    return { message: 'Пользователь удалён', id };
  }

  getSseEvents(): Observable<MessageEvent> {
    return this.eventSubject.asObservable();
  }

  async findByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email не может быть пустым');
    }

    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findPetsByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { pets: true },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.pets;
  }
  async createPetForUser(
    userId: string,
    petData: { name: string; type: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.prisma.pet.create({
      data: {
        name: petData.name,
        type: petData.type,
        ownerId: userId,
      },
    });
  }
}
