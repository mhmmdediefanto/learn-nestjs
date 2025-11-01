import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.prisma.tool.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        pricePerDay: true,
        stock: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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

  update(id: number, updateToolDto: UpdateToolDto) {
    return `This action updates a #${id} tool`;
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
