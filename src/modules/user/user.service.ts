import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/infra/database/prisma.service';
import { hasPassword } from 'src/common/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingEmail = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingEmail) {
      throw new BadRequestException('Email sudah terdaftar');
    }
    // hashing password
    const hashPassword = await hasPassword(createUserDto.password);
    createUserDto.password = hashPassword;
    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return user;
  }
}
