import { connectionSource } from 'src/config/typeorm';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import * as XLSX from 'xlsx';
import * as path from 'path';

interface EstandarExcelRow {
  grupo?: string;
  codigo?: string;
  descripcion?: string;
  criterios?: string;
}

const run = async () => {
  await connectionSource.initialize();
  const repo = connectionSource.getRepository(Estandar);

  console.log('📄 Leyendo archivo Excel...');

  const filePath = path.resolve(__dirname, '../Estandares.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<EstandarExcelRow>(sheet);

  console.log(`📊 Total filas leídas: ${rows.length}`);

  // ⚠️ Evitamos error si priorizacion_estandares no existe
  try {
    await connectionSource.query(
      'TRUNCATE TABLE "priorizacion_estandares", "estandares_acreditacion" CASCADE',
    );
  } catch (error) {
    console.warn('⚠️ Advertencia: No se pudo truncar alguna tabla:', error);
    await connectionSource.query(
      'TRUNCATE TABLE "estandares_acreditacion" CASCADE',
    );
  }

  const estandares: Partial<Estandar>[] = rows
    .filter((row) => row.grupo && row.codigo)
    .map((row) => {
      const criterios = String(row.criterios || '')
        .split(/\r?\n|\u2028|\u2029/)
        .map((c) => c.trim())
        .filter(Boolean);

      return {
        grupo: row.grupo?.trim() ?? '',
        codigo: row.codigo?.trim() ?? '',
        descripcion: row.descripcion?.trim() ?? '',
        criterios,
      };
    });

  console.log(`💾 Insertando ${estandares.length} estándares...`);
  await repo.save(estandares);
  console.log('✅ Seed de estándares completado.');
  await connectionSource.destroy();
};

run().catch((err) => {
  console.error('❌ Error ejecutando el seed:', err);
});
