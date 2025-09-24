// // src/hoja-radar/hoja-radar.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { HojaRadar } from './entities/hoja-radar.entity';
// import { CalificacionEstandar } from 'src/evaluacion/entities/calificacion.entity';

// @Injectable()
// export class HojaRadarService {
//   constructor(
//     @InjectRepository(HojaRadar)
//     private readonly radarRepo: Repository<HojaRadar>,

//     @InjectRepository(CalificacionEstandar)
//     private readonly calificacionRepo: Repository<CalificacionEstandar>,
//   ) {}

//   async generar(autoevaluacionId: number) {
//     const calificaciones = await this.calificacionRepo.find({
//       where: { autoevaluacionId },
//     });

//     const grupos = [1, 2, 3, 4, 5, 6];
//     const nombres = [
//       'Enfoque',
//       'Implementación en la institución',
//       'Resultados',
//       'Gestión del riesgo',
//       'Mejoramiento continuo',
//       'Satisfacción del usuario',
//     ];

//     const radarData: HojaRadar[] = [];

//     for (let i = 0; i < grupos.length; i++) {
//       const grupo = grupos[i];
//       const nombre = nombres[i];

//       const calGrupo = calificaciones.filter((c) =>
//         c.estandar?.codigo?.startsWith(`E${grupo}`),
//       );
//       const enfoque = this.avg(calGrupo.map((c) => c.sistematicidad));
//       const impl = this.avg(calGrupo.map((c) => c.despliegue_institucion));
//       const resul = this.avg(calGrupo.map((c) => c.pertinencia));

//       const total = this.avg([enfoque, impl, resul]);

//       const fila = this.radarRepo.create({
//         grupo,
//         nombre_grupo: nombre,
//         autoevaluacion_id: autoevaluacionId,
//         promedio_enfoque: enfoque,
//         promedio_implementacion: impl,
//         promedio_resultados: resul,
//         porcentaje_total: total,
//       });

//       await this.radarRepo.save(fila);
//       radarData.push(fila);
//     }

//     return radarData;
//   }

//   private avg(values: number[]) {
//     const valid = values.filter((v) => typeof v === 'number');
//     if (valid.length === 0) return 0;
//     return +(valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2);
//   }
// }
