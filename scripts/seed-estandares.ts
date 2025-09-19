import { config as dotenvconfig } from 'dotenv';
dotenvconfig({ path: `.env.${process.env.NODE_ENV || 'development'}` });
dotenvconfig(); // fallback por si no encuentra .env específico

import { DataSource } from 'typeorm';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Proceso } from 'src/processes/entities/process.entity';
import { IndicadorProceso } from 'src/processes/entities/indicador-proceso.entity';
import { SeleccionProceso } from 'src/processes/entities/SeleccionProceso.entity';
import * as XLSX from 'xlsx';
import * as path from 'path';

// 📌 Debug de variables de entorno
console.log('🔑 DB Config:');
console.log('  Host:', process.env.DB_HOST);
console.log('  Port:', process.env.DB_PORT);
console.log('  User:', process.env.DB_USER);
console.log(
  '  Password:',
  process.env.DB_PASSWORD ? '(cargada)' : '(vacía o undefined)',
);
console.log('  Database:', process.env.DB_NAME);

// ⚡️ DataSource exclusivo para seeds
const seedDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT! || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '', // 👈 siempre string
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [
    Estandar,
    Autoevaluacion,
    EvaluacionCualitativaEstandar,
    Ciclo,
    OportunidadMejoraEstandar,
    Sede,
    Institution,
    User,
    Event,
    Proceso,
    IndicadorProceso,
    SeleccionProceso,
  ],
});

type Row = Record<string, string>;

const normKey = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .replace(/\./g, '');

const pick = (row: Row, ...keys: string[]) => {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== '') return String(row[k]);
  }
  return '';
};

const splitByNumbering = (raw: string) => {
  const text = String(raw || '').trim();
  if (!text) return [];
  const matches = [...text.matchAll(/\b(\d+)\.\s([^]+?)(?=(?:\s\d+\.\s)|$)/g)];
  if (matches.length > 0) return matches.map((m) => m[2].trim());
  return text
    .split(/\r?\n|\u2028|\u2029/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const run = async () => {
  await seedDataSource.initialize();
  const estandarRepo = seedDataSource.getRepository(Estandar);
  const autoevalRepo = seedDataSource.getRepository(Autoevaluacion);

  console.log('📄 Leyendo archivo Excel...');
  const filePath = path.resolve(__dirname, '../Estandares.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
  });
  const rows: Row[] = rawRows.map((r) => {
    const mapped: Row = {};
    Object.entries(r).forEach(([k, v]) => {
      mapped[normKey(k)] =
        v == null
          ? ''
          : typeof v === 'object' && !Array.isArray(v)
            ? JSON.stringify(v)
            : // eslint-disable-next-line @typescript-eslint/no-base-to-string
              String(v);
    });
    return mapped;
  });

  console.log(`📊 Total filas leídas: ${rows.length}`);

  try {
    await seedDataSource.query(
      'TRUNCATE TABLE "estandares_acreditacion" CASCADE',
    );
    console.log('🧹 Tabla estandares_acreditacion truncada.');
  } catch (error) {
    console.warn(
      '⚠️ No se pudo truncar la tabla estandares_acreditacion:',
      error,
    );
  }

  const estandares: Partial<Estandar>[] = rows
    .filter(
      (row) => pick(row, 'grupo') && pick(row, 'codigo', 'código', 'codigo'),
    )
    .map((row) => {
      const grupo = pick(row, 'grupo');
      const codigo = pick(row, 'codigo', 'código');
      const descripcion = pick(row, 'descripcion', 'descripción');
      const criteriosRaw = pick(row, 'criterios');

      let criterios = splitByNumbering(criteriosRaw);

      const teniaNumeracion = /\b\d+\.\s/.test(criteriosRaw);
      if (!teniaNumeracion) {
        criterios = criterios.map((c, i) => `${i + 1}. ${c}`);
      }

      return { grupo, codigo, descripcion, criterios };
    });

  console.log(`💾 Insertando ${estandares.length} estándares...`);
  const estandaresGuardados = await estandarRepo.save(estandares);
  console.log('✅ Estándares insertados correctamente.');

  let autoeval = await autoevalRepo.findOne({
    where: { id: 1 },
    relations: ['estandares'],
  });

  if (!autoeval) {
    autoeval = autoevalRepo.create({
      id: 1,
      sede_id: 1,
      usuario_id: 1,
      ciclo: '2025',
      estandares: [],
    });
  }

  autoeval.estandares = estandaresGuardados;
  await autoevalRepo.save(autoeval);
  console.log(
    `✅ Asociados ${estandaresGuardados.length} estándares a autoevaluación ID 1.`,
  );

  await seedDataSource.destroy();
  console.log('🏁 Proceso de seed finalizado.');
};

run().catch((err) => {
  console.error('❌ Error ejecutando el seed:', err);
});
