import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Prisma 7 CLI auto-loads `.env`. We keep a local fallback so generate works
// even without env configured (real values come from `.env`).
const url =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:54322/postgres';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'npx ts-node prisma/seed.ts && npx ts-node prisma/seed-exercises.ts && npx ts-node prisma/seed-all-stories.ts',
  },
  datasource: {
    url,
  },
});