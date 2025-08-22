import { Controller, Get, Param, Delete } from '@nestjs/common';
import { PamecService } from './pamec.service';

@Controller('pamec')
export class PamecController {
  constructor(private readonly pamecService: PamecService) {}

  @Get()
  findAll() {
    return this.pamecService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pamecService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pamecService.remove(+id);
  }
}
