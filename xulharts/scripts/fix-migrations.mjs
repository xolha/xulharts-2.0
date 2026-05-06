import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

// Insere o registro da migration 0003 que foi aplicada via db:push mas não registrada
await sql`
  INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
  VALUES ('ddcd910cec8a35f5d22e21875298f9cb39fa7e96541ca23599e2a031e667bc2b', 1769212463185)
  ON CONFLICT DO NOTHING
`;

console.log('✓ Migration 0003 registrada em __drizzle_migrations');

const rows = await sql`SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at ASC`;
console.log('Estado atual das migrations:');
rows.forEach(r => console.log(`  id=${r.id} created_at=${r.created_at}`));

await sql.end();
