import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  getRatingByUserId,
  getTimeslotsByUsername,
  getUserWithPasswordHashByUsername,
  Rating,
  Timeslot,
  User,
} from '../../util/database';

type LoginRequestBody = {
  username: string;
  password: string;
};

type LoginNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: LoginRequestBody;
};

export type LoginResponseBody =
  | { errors: { message: string }[] }
  | {
      user: User;
      provider: number;
      timeslots: Timeslot[];
    };

export default async function loginHandler(
  request: LoginNextApiRequest,
  response: NextApiResponse<LoginResponseBody>,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.username !== 'string' ||
      !request.body.username ||
      typeof request.body.password !== 'string' ||
      !request.body.password
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Username or password not provided',
          },
        ],
      });
      return; // Important: will prevent "Headers already sent" error
    }

    const userWithPasswordHash = await getUserWithPasswordHashByUsername(
      request.body.username,
    );

    if (!userWithPasswordHash) {
      response.status(401).json({
        errors: [
          {
            message: 'Username or password does not match',
          },
        ],
      });
      return; // Important: will prevent "Headers already sent" error
    }

    const passwordMatches = await bcrypt.compare(
      request.body.password,
      userWithPasswordHash.passwordHash,
    );

    if (!passwordMatches) {
      response.status(401).json({
        errors: [
          {
            message: 'Username or password does not match',
          },
        ],
      });
      return; // Important: will prevent "Headers already sent" error
    }

    // 1. Create a unique token
    const token = crypto.randomBytes(64).toString('base64');

    // 2. Create the session
    const session = await createSession(token, userWithPasswordHash.id);

    // 3. Serialize the cookie
    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    // 4. get ratings and timeslots by user id
    const timeslots = await getTimeslotsByUsername(
      userWithPasswordHash.username,
    );

    const ratings = await getRatingByUserId(userWithPasswordHash.id);
    const ratingArray = ratings.map((rating: Rating) => rating.rating);
    let averageRating;
    if (Number.isNaN(averageRating)) {
      averageRating = 0;
    } else {
      averageRating =
        ratingArray.reduce((a: number, c: number) => a + c, 0) / ratings.length;
    }

    // 5. Add the cookie to the header response
    response
      .status(201)
      .setHeader('Set-Cookie', serializedCookie)
      .json({
        user: {
          id: userWithPasswordHash.id,
          firstName: userWithPasswordHash.firstName,
          lastName: userWithPasswordHash.lastName,
          age: userWithPasswordHash.age,
          username: userWithPasswordHash.username,
          shortDescription: userWithPasswordHash.shortDescription,
          isProvider: userWithPasswordHash.isProvider,
        },
        provider: averageRating,
        timeslots: timeslots,
      });
    return;
  }

  response.status(405).json({
    errors: [
      {
        message: 'Method not supported, try POST instead',
      },
    ],
  });
}
