import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}
  async create(createToolDto: CreateToolDto) {
    const tools = await this.prisma.tool.create({
      data: createToolDto,
    });
    return tools;
  }

  async findAll() {
    try {
      const [total, tools] = await Promise.all([
        this.prisma.tool.count(),
        this.prisma.tool.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            name: true,
            category: true,
            description: true,
            stock: true,
            pricePerDay: true,
          },
        }),
      ]);

      return {
        total,
        tools,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    const checkId = await this.prisma.tool.findUnique({
      where: {
        id: id,
      },
    });

    if (!checkId) {
      throw new NotFoundException('Tool tidak ditemukan');
    }

    return checkId;
  }

  async update(id: string, updateToolDto: UpdateToolDto) {
    const existId = await this.prisma.tool.findUnique({
      where: {
        id,
      },
    });

    if (!existId) {
      throw new NotFoundException('Tool tidak ditemukan');
    }

    const tool = await this.prisma.tool.update({
      where: {
        id: id,
      },
      data: updateToolDto,
    });
    return tool;
  }

  async remove(id: string) {
    const tool = await this.prisma.tool.findUnique({
      where: {
        id: id,
      },
    });
    if (!tool) {
      throw new NotFoundException('Tool tidak ditemukan');
    }
    return await this.prisma.tool.delete({
      where: {
        id: id,
      },
    });
  }
}
