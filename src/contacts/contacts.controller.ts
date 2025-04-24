import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Sse,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Observable } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll() {
    return await this.contactsService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.contactsService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.contactsService.remove(id);
  }

  @Sse('events')
  getContactEvents(): Observable<MessageEvent> {
    return this.contactsService.getSseEvents();
  }
}
