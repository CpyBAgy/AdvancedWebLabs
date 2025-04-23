import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Observable, Subject } from 'rxjs';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  private eventSubject = new Subject<MessageEvent>();

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.service.findMany();
  }
  async findAllPaginated(page: number, limit: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.service.count(),
    ]);

    return {
      data,
      total,
      page,
      next:
        total > page * limit
          ? `/api/services?page=${page + 1}&limit=${limit}`
          : null,
      prev: page > 1 ? `/api/services?page=${page - 1}&limit=${limit}` : null,
    };
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Услуга не найдена');
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Услуга с ID ${id} не найдена`);
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
      },
    });
  }

  async create(data) {
    const price = parseFloat(data.price);
    if (isNaN(price)) {
      throw new BadRequestException('Неверный формат цены');
    }

    return this.prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        price,
      },
    });
  }

  async remove(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException(
        `Ошибка: Услуга с ID ${id} не найдена или уже удалена`,
      );
    }

    const deletedService = await this.prisma.service.delete({ where: { id } });

    this.eventSubject.next(
      new MessageEvent('service', {
        data: { action: 'deleted', service: deletedService },
      }),
    );

    return { message: 'Услуга удалена', id };
  }

  getSseEvents(): Observable<MessageEvent> {
    return this.eventSubject.asObservable();
  }
}
