// // src/evaluacion/detalle-priorizacion.controller.ts

// import {
//   Controller,
//   Post,
//   Patch,
//   Get,
//   Param,
//   Body,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { DetallePriorizacionService } from './detalle-priorizacion.service';
// import { CreateDetallePriorizacionDto } from './dto/create-detalle-priorizacion.dto';
// import { UpdateDetallePriorizacionDto } from './dto/update-detalle-priorizacion.dto';

// @Controller()
// export class DetallePriorizacionController {
//   constructor(private readonly service: DetallePriorizacionService) {}

//   @Post('/priorizacion/:priorizacionId/detalle')
//   create(
//     @Param('priorizacionId', ParseIntPipe) priorizacionId: number,
//     @Body() dto: CreateDetallePriorizacionDto,
//   ) {
//     return this.service.create(priorizacionId, dto);
//   }

//   @Get('/priorizacion/:priorizacionId/detalle')
//   findOne(@Param('priorizacionId', ParseIntPipe) priorizacionId: number) {
//     return this.service.findByPriorizacion(priorizacionId);
//   }

//   @Patch('/detalle-priorizacion/:id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() dto: UpdateDetallePriorizacionDto,
//   ) {
//     return this.service.update(id, dto);
//   }
// }
