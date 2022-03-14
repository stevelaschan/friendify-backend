import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUserByUsername, User, createSession } from '../../util/database';
import crypto from 'node:crypto';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';


type SignupRequestBody = {
  username: string;
  password: string;
};

type SignupNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: SignupRequestBody;
};

export type SignupResponseBody =
  | { errors: { message: string }[] }
  | { user: User };

export default async function signupHandler(
  request: SignupNextApiRequest,
  response: NextApiResponse<SignupResponseBody>,
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

    // If there is already a user matching the username,
    // return error message
    if (await getUserByUsername(request.body.username)) {
      response.status(409).json({
        errors: [
          {
            message: 'Username already taken',
          },
        ],
      });
      return; // Important: will prevent "Headers already sent" error
    }

    const passwordHash = await bcrypt.hash(request.body.password, 12);
    const user = await createUser(request.body.firstName, request.body.lastName, request.body.age, request.body.username, passwordHash);

    // 1. Create a unique token
    const token = crypto.randomBytes(64).toString('base64');

    // 2. Create the session
    const session = await createSession(token, user.id);

    // console.log(session);

    // 3. Serialize the cookie
    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    // 4. Add the cookie to the header response
    response
      .status(201)
      .setHeader('Set-Cookie', serializedCookie)
      .json({ user: user });
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