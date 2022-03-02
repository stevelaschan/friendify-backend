import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUserByUsername, User } from '../../util/database';

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
    const user = await createUser(request.body.username, passwordHash);
    response
      .status(201)
      .setHeader('Access-Control-Allow-Origin', '*')
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
