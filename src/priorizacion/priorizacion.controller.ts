// import {
//   Controller,
//   Post,
//   Get,
//   Patch,
//   Delete,
//   Param,
//   Body,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { PriorizacionService } from './priorizacion.service';
// import { CreatePriorizacionDto } from './dto/create-priorizacion.dto';
// import { UpdatePriorizacionDto } from './dto/update-priorizacion.dto';

// @Controller()
// export class PriorizacionController {
//   constructor(private readonly service: PriorizacionService) {}

//   @Post('estandares/:id/priorizacion')
//   crear(
//     @Param('id', ParseIntPipe) estandarId: number,
//     @Body() dto: CreatePriorizacionDto,
//   ) {
//     return this.service.crear(estandarId, dto);
//   }

//   @Patch('priorizacion/:id')
//   actualizar(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() dto: UpdatePriorizacionDto,
//   ) {
//     return this.service.actualizar(id, dto);
//   }

//   @Delete('priorizacion/:id')
//   eliminar(@Param('id', ParseIntPipe) id: number) {
//     return this.service.eliminar(id);
//   }

//   @Get('autoevaluaciones/:id/priorizacion')
//   listar(@Param('id', ParseIntPipe) autoevaluacionId: number) {
//     return this.service.listarPorAutoevaluacion(autoevaluacionId);
//   }
// }
