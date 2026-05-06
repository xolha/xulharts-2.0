import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

// Tudo de migration 0004 já está aplicado no banco via db:push.
// Só registra no controle do Drizzle.
await sql`
  INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
  VALUES ('34e3c951eccfbbb880d3bcc79609eb3d0f99e58383b49c1f5d90821d129ba256', 1777941763357)
  ON CONFLICT DO NOTHING
`;
console.log('✓ Migration 0004 registrada em __drizzle_migrations');

const rows = await sql`SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at ASC`;
console.log('Estado final das migrations:');
rows.forEach(r => console.log(`  id=${r.id} created_at=${r.created_at}`));

await sql.end();
