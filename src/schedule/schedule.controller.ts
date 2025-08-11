import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { ScheduleTaskService } from './schedule.service';
import { CreateScheduleTaskDto } from './dto/CreateScheduleTaskDto';
import { UpdateScheduleTaskDto } from './dto/UpdateScheduleTaskDto';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';

const estadoOut = (e?: string) =>
  e === 'pendiente'
    ? 'Pendiente'
    : e === 'en proceso'
      ? 'En progreso'
      : e === 'finalizado'
        ? 'Finalizado'
        : e;

@Controller('schedule-tasks')
export class ScheduleTaskController {
  constructor(private readonly scheduleTaskService: ScheduleTaskService) {}

  @Post()
  create(@Body() createDto: CreateScheduleTaskDto) {
    return this.scheduleTaskService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('cicloId') cicloId?: string,
    @Query('sedeId') sedeId?: string,
    @Query('institucionId') institucionId?: string,
    @Query('responsable') responsable?: string,
  ) {
    const tasks = await this.scheduleTaskService.findAll({
      cicloId: cicloId ? +cicloId : undefined,
      sedeId: sedeId ? +sedeId : undefined,
      institucionId: institucionId ? +institucionId : undefined,
      responsable,
    });
    // Opcional: devolver estado capitalizado para el front
    return tasks.map((t) => ({ ...t, estado: estadoOut(t.estado) }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleTaskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateScheduleTaskDto) {
    return this.scheduleTaskService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleTaskService.remove(+id);
  }

  // ----- EXPORTS (sin cambios relevantes, solo mapear estado si quieres) -----

  @Get('export/excel')
  async exportExcel(
    @Res() res: Response,
    @Query('cicloId') cicloId?: string,
    @Query('sedeId') sedeId?: string,
    @Query('institucionId') institucionId?: string,
    @Query('responsable') responsable?: string,
  ) {
    const tasks = await this.scheduleTaskService.findAll({
      cicloId: cicloId ? +cicloId : undefined,
      sedeId: sedeId ? +sedeId : undefined,
      institucionId: institucionId ? +institucionId : undefined,
      responsable,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cronograma');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Tarea', key: 'nombre_tarea', width: 30 },
      { header: 'Duración', key: 'duracion', width: 10 },
      { header: 'Fecha Inicio', key: 'fecha_comienzo', width: 15 },
      { header: 'Fecha Fin', key: 'fecha_fin', width: 15 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Responsable', key: 'responsable', width: 20 },
      { header: 'Progreso', key: 'progreso', width: 10 },
      { header: 'Observaciones', key: 'observaciones', width: 30 },
      { header: 'Predecesoras', key: 'predecesoras', width: 15 },
      { header: 'Sede ID', key: 'sedeId', width: 10 },
      { header: 'Institución ID', key: 'institucionId', width: 15 },
      { header: 'Parent ID', key: 'parentId', width: 10 },
    ];

    tasks.forEach((task) => {
      worksheet.addRow({
        id: task.id,
        nombre_tarea: task.nombre_tarea,
        duracion: task.duracion ?? '',
        fecha_comienzo: task.fecha_comienzo
          ? new Date(task.fecha_comienzo).toISOString().split('T')[0]
          : '',
        fecha_fin: task.fecha_fin
          ? new Date(task.fecha_fin).toISOString().split('T')[0]
          : '',
        estado: estadoOut(task.estado),
        responsable: task.responsable ?? '',
        progreso: task.progreso ?? '',
        observaciones: task.observaciones ?? '',
        predecesoras: task.predecesoras ?? '',
        sedeId: task.sedeId ?? '',
        institucionId: task.institucionId ?? '',
        parentId: typeof task.parentId !== 'undefined' ? task.parentId : '',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=cronograma.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('export/pdf')
  async exportPDF(
    @Res() res: Response,
    @Query('cicloId') cicloId?: string,
    @Query('sedeId') sedeId?: string,
    @Query('institucionId') institucionId?: string,
    @Query('responsable') responsable?: string,
  ) {
    const tasks = await this.scheduleTaskService.findAll({
      cicloId: cicloId ? +cicloId : undefined,
      sedeId: sedeId ? +sedeId : undefined,
      institucionId: institucionId ? +institucionId : undefined,
      responsable,
    });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cronograma.pdf');

    doc.pipe(res);

    doc.fontSize(16).text('Cronograma de Actividades', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10);
    const headers = [
      'ID',
      'Tarea',
      'Duración',
      'Fecha Inicio',
      'Fecha Fin',
      'Estado',
      'Responsable',
      'Progreso',
      'Observaciones',
      'Predecesoras',
      'SedeID',
      'InstituciónID',
      'ParentID',
    ];
    doc.text(headers.join(' | '));
    doc.moveDown(0.5);

    tasks.forEach((task) => {
      doc.text(
        [
          task.id,
          task.nombre_tarea,
          task.duracion ?? '',
          task.fecha_comienzo
            ? new Date(task.fecha_comienzo).toISOString().split('T')[0]
            : '',
          task.fecha_fin
            ? new Date(task.fecha_fin).toISOString().split('T')[0]
            : '',
          estadoOut(task.estado),
          task.responsable ?? '',
          task.progreso ?? '',
          task.observaciones ?? '',
          task.predecesoras ?? '',
          task.sedeId ?? '',
          task.institucionId ?? '',
          task.parentId ?? '',
        ].join(' | '),
      );
      doc.moveDown(0.2);
    });

    doc.end();
  }
}
