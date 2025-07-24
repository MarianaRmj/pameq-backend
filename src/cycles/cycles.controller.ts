import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CyclesService } from './cycles.service';
import { CreateCicloDto } from './dto/create-cycle.dto';
import { UpdateCicloDto } from './dto/update-cycle.dto';

@Controller('cycles')
export class CyclesController {
  constructor(private readonly ciclosService: CyclesService) {}

  @Post()
  create(@Body() dto: CreateCicloDto) {
    return this.ciclosService.create(dto);
  }

  @Get()
  findAll() {
    return this.ciclosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ciclosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCicloDto, // ✅ usa el DTO correcto
  ) {
    return this.ciclosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ciclosService.remove(id);
  }
}
