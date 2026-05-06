import postgres from 'postgres';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const rows = await sql`SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at ASC`;
console.log('Migrations registradas no banco:');
rows.forEach(r => console.log(r));

// Verifica hash dos arquivos locais
const migrations = [
  { idx: 0, file: 'lib/db/migrations/0000_sour_sir_ram.sql', tag: '0000_sour_sir_ram' },
  { idx: 1, file: 'lib/db/migrations/0001_unknown_hemingway.sql', tag: '0001_unknown_hemingway' },
  { idx: 2, file: 'lib/db/migrations/0002_long_rachel_grey.sql', tag: '0002_long_rachel_grey' },
  { idx: 3, file: 'lib/db/migrations/0003_numerous_kulan_gath.sql', tag: '0003_numerous_kulan_gath' },
  { idx: 4, file: 'lib/db/migrations/0004_neat_zzzax.sql', tag: '0004_neat_zzzax' },
];

console.log('\nHashes locais (SHA256 do conteúdo SQL):');
migrations.forEach(m => {
  const content = readFileSync(m.file, 'utf8');
  const hash = createHash('sha256').update(content).digest('hex');
  console.log(`${m.tag}: ${hash}`);
});

await sql.end();
