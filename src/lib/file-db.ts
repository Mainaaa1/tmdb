// In-memory mock store for auth state. This avoids persisting real user details
// in a public repository and keeps login state alive only while the server runs.
import type { AuthDb, AuthUser } from '@/lib/types';

const DEMO_USER: AuthUser = {
  id: 'demo-user-0000-0000-0000-000000000000',
  username: 'Demo User',
  email: 'guest@example.com',
  passwordHash: 'demo-salt-12345678:aQv75JBGtPpf6aDBjPfOhcNed7JDDKarOlycdc1q_N4wjMlsVyBmawVvhAzA8kY5s9wy0W2CfFXwxPIS9XKNvQ',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  passwordChangedAt: '2026-01-01T00:00:00.000Z',
};

const EMPTY_DB: AuthDb = {
  users: [],
  sessions: [],
};

let dbCache: AuthDb | null = null;
let updatePromise: Promise<void> = Promise.resolve();

export async function readDb(): Promise<AuthDb> {
  if (dbCache === null) {
    dbCache = {
      users: [DEMO_USER],
      sessions: [],
    };
  }

  return {
    users: [...dbCache.users],
    sessions: [...dbCache.sessions],
  };
}

export async function writeDb(db: AuthDb) {
  dbCache = {
    users: [...db.users],
    sessions: [...db.sessions],
  };
}

export async function updateDb(updater: (db: AuthDb) => Promise<AuthDb> | AuthDb) {
  let nextDb: AuthDb | undefined;
  const run = updatePromise.catch(() => undefined).then(async () => {
    const current = await readDb();
    nextDb = await updater(current);
    await writeDb(nextDb);
  });
  updatePromise = run.then(() => undefined, () => undefined);

  await run;
  return nextDb as AuthDb;
}

export async function resetDbForTests() {
  await writeDb({ ...EMPTY_DB });
}
