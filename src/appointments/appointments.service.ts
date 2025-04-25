import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AppointmentsService {
  private eventSubject = new Subject<{
    action: string;
    appointment?: any;
    deletedId?: string;
  }>();

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.appointment.findMany();
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { pet: true, service: true },
      /*select: {
        id: true,
        date: true,
        petId: true,
        serviceId: true,
      },*/
    });
    if (!appointment) {
      throw new NotFoundException('Запись не найдена');
    }
    return appointment;
  }

  async findByUserId(userId: string) {
    return await this.prisma.appointment.findMany({
      where: { pet: { ownerId: userId } },
      include: { pet: true, service: true },
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const [appointments, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          pet: true,
          service: true,
        },
      }),
      this.prisma.appointment.count(),
    ]);

    return {
      data: appointments,
      total,
      page,
      next:
        total > page * limit
          ? `/api/appointments?page=${page + 1}&limit=${limit}`
          : null,
      prev:
        page > 1 ? `/api/appointments?page=${page - 1}&limit=${limit}` : null,
    };
  }
  async create(dto: CreateAppointmentDto) {
    const pet = await this.prisma.pet.findUnique({ where: { id: dto.petId } });
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });

    if (!pet) throw new NotFoundException('Питомец не найден');
    if (!service) throw new NotFoundException('Услуга не найдена');

    const formattedDate = new Date(dto.date);
    const newAppointment = await this.prisma.appointment.create({
      data: {
        date: formattedDate.toISOString(),
        pet: { connect: { id: dto.petId } },
        service: { connect: { id: dto.serviceId } },
      },
      include: { pet: true, service: true },
    });

    this.eventSubject.next({ action: 'created', appointment: newAppointment });

    return newAppointment;
  }

  async remove(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new BadRequestException(
        `Ошибка: Запись с ID ${id} не найдена или уже удалена`,
      );
    }

    await this.prisma.appointment.delete({ where: { id } });

    this.broadcastEvent({ action: 'deleted', deletedId: id });

    return { message: 'Запись удалена', id };
  }

  broadcastEvent(event: {
    action: string;
    appointment?: any;
    deletedId?: string;
  }) {
    this.eventSubject.next(event);
  }

  getSseEvents(): Observable<{
    action: string;
    appointment?: any;
    deletedId?: string;
  }> {
    return this.eventSubject.asObservable();
  }

  async update(id: string, updateData: Partial<CreateAppointmentDto>) {
    const existing = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Запись с ID ${id} не найдена`);
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });

    this.eventSubject.next({
      action: 'updated',
      appointment: updatedAppointment,
    });

    return updatedAppointment;
  }
}
