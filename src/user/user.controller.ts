import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getAllUsers();
  }
}
