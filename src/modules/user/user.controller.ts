import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role('ADMIN')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      data: new UserEntity(user),
      message: 'User berhasil dibuat',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  async findAll() {
    const { total, users } = await this.userService.findAll();
    return {
      data: users,
      count: total,
      message: 'User berhasil ditemukan',
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return {
      data: user,
      message: 'User berhasil ditemukan',
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id);
    return {
      data: new UserEntity(user),
      message: 'User berhasil dihapus',
      statusCode: HttpStatus.OK,
    };
  }
}
