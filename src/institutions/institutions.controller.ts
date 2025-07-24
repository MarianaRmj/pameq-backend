import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionService: InstitutionsService) {}

  @Post()
  create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.institutionService.create(createInstitutionDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ) {
    console.log('📥 PATCH institución', { id, updateInstitutionDto });

    try {
      const updated = await this.institutionService.update(
        id,
        updateInstitutionDto,
      );
      console.log('✅ Institución actualizada correctamente');
      return updated;
    } catch (error) {
      console.error('❌ Error en InstitutionsController.update:', error);
      throw error; // o usa HttpException si quieres personalizar el mensaje
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.institutionService.findOne(id);
  }

  @Get(':id/ciclos')
  findCiclos(@Param('id', ParseIntPipe) id: number) {
    return this.institutionService.findCiclosByInstitution(id);
  }
}
