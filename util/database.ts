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

// USER
export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  age: string;
  shortDescription: string;
  isProvider: boolean;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

// CREATE
export async function createUser(
  firstName: string,
  lastName: string,
  age: string,
  username: string,
  passwordHash: string,
  shortDescription: string,
  isProvider: boolean,
) {
  const [user] = await sql<[User]>`
    INSERT INTO users
      (first_name, last_name, age, username, password_hash, short_description, is_provider)
    VALUES
      (${firstName}, ${lastName}, ${age}, ${username}, ${passwordHash}, ${shortDescription}, ${isProvider})
    RETURNING
      id,
      first_name,
      last_name,
      age,
      username,
      short_description,
      is_provider
  `;
  return camelcaseKeys(user);
}

// READ
// by id
export async function getUserById(id: number) {
  const [user] = await sql<[User | undefined]>`
    SELECT
      *
    FROM
      users
    WHERE
      id = ${id}
  `;
  return user && camelcaseKeys(user);
}

// by valid session token
export async function getUserByValidSessionToken(token: string | undefined) {
  if (!token) return undefined;
  const [user] = await sql<[User | undefined]>`
    SELECT
      users.id,
      users.username,
      users.first_name,
      users.last_name,
      users.age,
      users.short_description,
      users.is_provider
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

// by username
export async function getUserByUsername(username: string) {
  const [user] = await sql<[{ id: number } | undefined]>`
    SELECT
    id,
    first_name,
    last_name,
    age,
    username,
    short_description,
    is_provider
    FROM
    users
    WHERE username = ${username}
  `;
  return user && camelcaseKeys(user);
}

// all users
export async function getAllUsers() {
  const users = await sql<User[]>`
    SELECT
    id,
    username,
    age,
    short_description,
    is_provider
    FROM
    users
  `;
  return users.map((user: User) => camelcaseKeys(user));
}

// with passwordhash by username
export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT
      id,
      username,
      first_name,
      last_name,
      age,
      short_description,
      is_provider,
      password_hash
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}

// UPDATE
// by username
export async function updateUserByUsername(
  username: string,
  firstName: string,
  lastName: string,
  age: string,
  shortDescription: string,
  isProvider: boolean,
) {
  const [user] = await sql<[User | undefined]>`
    UPDATE
      users
    SET
      first_name = ${firstName},
      last_name = ${lastName},
      age = ${age},
      short_description = ${shortDescription},
      is_provider = ${isProvider}
    WHERE
      username = ${username}
    RETURNING *
  `;
  return user && camelcaseKeys(user);
}

// RATING

export type Rating = {
  id: number;
  userId: number;
  providerId: number;
  rating: number;
};

// CREATE
export async function createRating(
  userId: number,
  providerId: number,
  rating: number,
) {
  const [stars] = await sql<[Rating | undefined]>`
    INSERT INTO ratings
      (user_id, provider_id, rating)
    VALUES
      (${userId}, ${providerId}, ${rating})
    RETURNING
      *
  `;
  return stars && camelcaseKeys(stars);
}

export async function getRatingByUserId(id: number) {
  const stars = await sql<Rating[]>`
    SELECT
      *
    FROM
      ratings
    WHERE
      user_id = ${id}
  `;
  // return camelcaseKeys(stars);
  return stars.map((star) => camelcaseKeys(star));
}

export async function getAllRatings() {
  const stars = await sql<Rating[]>`
    SELECT
      *
    FROM
      ratings
  `;
  return stars.map((star: Rating) => camelcaseKeys(star));
}

// SESSION TOKEN

export type Session = {
  id: number;
  token: string;
  userId: number;
};

// CREATE
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

// READ
// by valid session token
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

// DELETE
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

  return sessions.map((session: Session) => camelcaseKeys(session));
}

// TIMESLOTS
export type Timeslot = {
  id: number;
  providerId: number;
  timeslotDate: Date;
  timeslotTime: string;
  userUsername: string | null;
};

// CREATE
export async function createNewTimeslot(
  providerId: number,
  date: Date,
  time: string,
) {
  const [timeslot] = await sql<[Timeslot | undefined]>`
  INSERT INTO timeslots
    (provider_id, timeslot_date, timeslot_time)
  VALUES
    (${providerId}, ${date}, ${time} )
  RETURNING
    *
  `;
  // return timeslots.map((timeslot: Timeslot) => camelcaseKeys(timeslot));
  return timeslot && camelcaseKeys(timeslot);
}

// READ

export async function getTimeslotsByUserId(id: number) {
  const reservedTimeslots = await sql<Timeslot[]>`
    SELECT
      *
    FROM
      timeslots
    WHERE
      provider_id = ${id}
  `;
  return reservedTimeslots.map((timeslot) => camelcaseKeys(timeslot));
}

// UPDATE

export async function updateTimeslotWithUsername(
  username: string,
  providerId: number,
  timeslotTime: string,
  timeslotDate: Date,
) {
  const updatedTimeslots = await sql`
    UPDATE
      timeslots
    SET
      user_username = ${username}
    WHERE
      provider_id = ${providerId} AND
      timeslot_time = ${timeslotTime} AND
      timeslot_date = ${timeslotDate}
    RETURNING *
  `;
  return camelcaseKeys(updatedTimeslots);
}

// DELETE

export async function deleteTimeslot(
  providerId: number,
  timeslotDate: Date,
  timeslotTime: string,
) {
  const [deletedTimeslot] = await sql`
    DELETE FROM
      timeslots
    WHERE
      provider_id = ${providerId} AND
      timeslot_date = ${timeslotDate} AND
      timeslot_time = ${timeslotTime}
    RETURNING
      *
  `;
  return camelcaseKeys(deletedTimeslot);
}
