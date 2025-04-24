import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ContactsService {
  private eventSubject = new Subject<MessageEvent>();

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.contact.findMany();
  }

  async update(id: string, updateData: any) {
    const updatedContact = await this.prisma.contact.update({
      where: { id },
      data: updateData,
    });

    this.eventSubject.next(
      new MessageEvent('contact', {
        data: { action: 'updated', contact: updatedContact },
      }),
    );
    return updatedContact;
  }

  async remove(id: string) {
    const deletedContact = await this.prisma.contact.delete({ where: { id } });

    this.eventSubject.next(
      new MessageEvent('contact', {
        data: { action: 'deleted', contact: deletedContact },
      }),
    );
    return deletedContact;
  }

  getSseEvents(): Observable<MessageEvent> {
    return this.eventSubject.asObservable();
  }
}
