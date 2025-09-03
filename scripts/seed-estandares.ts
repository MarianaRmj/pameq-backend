import { connectionSource } from 'src/config/typeorm';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';
import * as XLSX from 'xlsx';
import * as path from 'path';

type Row = Record<string, string>;

const normKey = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD') // quita acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .replace(/\./g, '');

const pick = (row: Row, ...keys: string[]) => {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== '') return String(row[k]);
  }
  return '';
};

// Extrae items numerados "1. ... 2. ... 3. ..." a un array
const splitByNumbering = (raw: string) => {
  const text = String(raw || '').trim();
  if (!text) return [];

  // Busca grupos tipo: "1. <texto del criterio>" hasta el próximo número o fin
  const matches = [...text.matchAll(/\b(\d+)\.\s([^]+?)(?=(?:\s\d+\.\s)|$)/g)];
  if (matches.length > 0) {
    return matches.map((m) => m[2].trim()); // devolvemos solo el contenido, sin “N. ”
  }

  // Fallback: por saltos de línea
  return text
    .split(/\r?\n|\u2028|\u2029/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const run = async () => {
  await connectionSource.initialize();
  const estandarRepo = connectionSource.getRepository(Estandar);
  const autoevalRepo = connectionSource.getRepository(Autoevaluacion);

  console.log('📄 Leyendo archivo Excel...');
  const filePath = path.resolve(__dirname, '../Estandares.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Leemos como objetos y normalizamos claves
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
  });
  const rows: Row[] = rawRows.map((r) => {
    const mapped: Row = {};
    Object.entries(r).forEach(([k, v]) => {
      mapped[normKey(k)] =
        v === null || v === undefined
          ? ''
          : typeof v === 'object' && !Array.isArray(v)
            ? JSON.stringify(v)
            : typeof v === 'object'
              ? JSON.stringify(v)
              : typeof v === 'object'
                ? JSON.stringify(v)
                : // eslint-disable-next-line @typescript-eslint/no-base-to-string
                  String(v);
    });
    return mapped;
  });

  console.log(`📊 Total filas leídas: ${rows.length}`);

  // ⚠️ Limpieza opcional
  try {
    await connectionSource.query(
      'TRUNCATE TABLE "estandares_acreditacion" CASCADE',
    );
    console.log('🧹 Tabla estandares_acreditacion truncada.');
  } catch (error) {
    console.warn(
      '⚠️ No se pudo truncar la tabla estandares_acreditacion:',
      error,
    );
  }

  // 🎯 Preparar los estándares
  const estandares: Partial<Estandar>[] = rows
    .filter(
      (row) => pick(row, 'grupo') && pick(row, 'codigo', 'código', 'codigo'),
    ) // acepta "Código"
    .map((row) => {
      const grupo = pick(row, 'grupo');
      const codigo = pick(row, 'codigo', 'código');
      const descripcion = pick(row, 'descripcion', 'descripción');
      const criteriosRaw = pick(row, 'criterios');

      let criterios = splitByNumbering(criteriosRaw);

      // Si los items no tenían numeración en el texto, numeramos ahora.
      const teniaNumeracion = /\b\d+\.\s/.test(criteriosRaw);
      if (!teniaNumeracion) {
        criterios = criterios.map((c, i) => `${i + 1}. ${c}`);
      }

      return { grupo, codigo, descripcion, criterios };
    });

  console.log(`💾 Insertando ${estandares.length} estándares...`);
  const estandaresGuardados = await estandarRepo.save(estandares);
  console.log('✅ Estándares insertados correctamente.');

  // 🧠 Upsert de autoevaluación 1
  let autoeval = await autoevalRepo.findOne({
    where: { id: 1 },
    relations: ['estandares'],
  });

  if (!autoeval) {
    autoeval = autoevalRepo.create({
      id: 1,
      sede_id: 1, // ajusta a tus IDs reales
      usuario_id: 1, // ajusta a tus IDs reales
      ciclo: '2025',
      estandares: [],
    });
  }

  autoeval.estandares = estandaresGuardados;
  await autoevalRepo.save(autoeval);
  console.log(
    `✅ Asociados ${estandaresGuardados.length} estándares a autoevaluación ID 1.`,
  );

  await connectionSource.destroy();
  console.log('🏁 Proceso de seed finalizado.');
};

run().catch((err) => {
  console.error('❌ Error ejecutando el seed:', err);
});
