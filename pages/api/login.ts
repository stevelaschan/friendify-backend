import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession, getUserWithPasswordHashByUsername, User, getUserByValidSessionToken, getUserByUsername } from '../../util/database';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';

type LoginRequestBody = {
  username: string;
  password: string;
};

type LoginNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: LoginRequestBody;
};

// export type LoginResponseBody =
//   | { errors: { message: string }[] }
//   | { user: Pick<User, 'id'> };

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

      // console.log(session);

      // 3. Serialize the cookie
      const serializedCookie = await createSerializedRegisterSessionTokenCookie(
        session.token,
      );

      // 4. get User by username
      const user = await getUserByUsername(request.body.username)

      // 5. Add the cookie to the header response
      response
        .status(201)
        .setHeader('Set-Cookie', serializedCookie)
        .json({
          user: {
            id: userWithPasswordHash.id,
            firstName: user.firstName,
            lastName : user.lastName,
            age: user.age,
            username: user.username,
          },
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
