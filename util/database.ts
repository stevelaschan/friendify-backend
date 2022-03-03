import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

// import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku.js';

// setPostgresDefaultsOnHeroku();
// Read the environment variables from the .env
// file, which will then be available for all
// following code
config();

// Type needed for the connection function below
declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    sql = postgres();
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }
  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

export type User = {
  id: number;
  username: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

// GET USER
export async function getUserById(id: number) {
  const [user] = await sql<[User | undefined]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      id = ${id}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserByValidSessionToken(token: string | undefined) {
  if (!token) return undefined;
  const [user] = await sql<[User | undefined]>`
    SELECT
      users.id,
      users.username
    FROM
      users,
      sessions
    WHERE
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      sessions.expiry_timestamp > now()
  `;
  return user && camelcaseKeys(user);
}

export async function getUserByUsername(username: string) {
  const [user] = await sql<[{ id: number } | undefined]>`
    SELECT id FROM users WHERE username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT
      id,
      username,
      password_hash
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}

// CREATE USER
export async function createUser(username: string, passwordHash: string) {
  const [user] = await sql<[User]>`
    INSERT INTO users
      (username, password_hash)
    VALUES
      (${username}, ${passwordHash})
    RETURNING
      id,
      username
  `;
  return camelcaseKeys(user);
}

// GET SESSION TOKEN
type Session = {
  id: number;
  token: string;
  userId: number;
};

export async function getValidSessionByToken(token: string | undefined) {
  if (!token) return undefined;
  const [session] = await sql<[Session | undefined]>`
    SELECT
      *
    FROM
      sessions
    WHERE
      token = ${token} AND
      expiry_timestamp > now()
  `;

  await deleteExpiredSessions();

  return session && camelcaseKeys(session);
}

// CREATE SESSION TOKEN
export async function createSession(token: string, userId: number) {
  const [session] = await sql<[Session]>`
  INSERT INTO sessions
    (token, user_id)
  VALUES
    (${token}, ${userId})
  RETURNING
   id,
   token
`;

  await deleteExpiredSessions();

  return camelcaseKeys(session);
}

// DELETE SESSION TOKEN
export async function deleteSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
  DELETE FROM
  sessions
  WHERE
    token = ${token}
  RETURNING *
`;
  return session && camelcaseKeys(session);
}

export async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < NOW()
    RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}
