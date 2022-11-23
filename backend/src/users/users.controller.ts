import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserUpdateSelfDto } from './dto/user-update-self.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async findLogged(@Req() req: Request) {
    return await this.usersService.findLoggedUser(req.user['username']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me')
  update(@Req() req: Request, @Body() updateSelfDto: UserUpdateSelfDto) {
    return this.usersService.updateSelf(req.user['username'], updateSelfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
