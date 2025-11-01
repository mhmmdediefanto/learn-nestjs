import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('tools')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role('ADMIN')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post()
  async create(@Body() createToolDto: CreateToolDto) {
    const tool = await this.toolsService.create(createToolDto);
    return {
      data: tool,
      message: 'Tool berhasil dibuat',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  async findAll() {
    const { total, tools } = await this.toolsService.findAll();
    return {
      data: tools,
      count: total,
      message: 'Tool berhasil ditemukan',
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tools = await this.toolsService.findOne(id);
    return {
      data: tools,
      message: 'Tool berhasil ditemukan',
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    const tool = await this.toolsService.update(id, updateToolDto);
    return {
      data: tool,
      message: 'Tool berhasil diupdate',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const tool = await this.toolsService.remove(id);
    return {
      data: tool,
      message: 'Tool berhasil dihapus',
      statusCode: HttpStatus.OK,
    };
  }
}
