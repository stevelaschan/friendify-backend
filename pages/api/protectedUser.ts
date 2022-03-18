import { NextApiRequest, NextApiResponse } from 'next';
import {
  getRatingByUserId,
  getUserByValidSessionToken,
  User,
} from '../../util/database';

type ProtectedUserRequestBody = {
  firstName: string;
  lastName: string;
  age: string;
  shortDescription: string;
  isProvider: boolean;
};

type ProtectedUserNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: ProtectedUserRequestBody;
};

type ProtectedUserResponseBody =
  | { error: string }
  | { user: User; provider: number };

export default async function protectedUserHandler(
  request: ProtectedUserNextApiRequest,
  response: NextApiResponse<ProtectedUserResponseBody>,
) {
  if (request.method === 'GET') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);
    const rating = await getRatingByUserId(user.id);
    // console.log(rating);
    if (!user) {
      response.status(404).json({
        error: 'User or Session not found',
      });
      return;
    }
    // console.log(user);

    response.json({
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        shortDescription: user.shortDescription,
        isProvider: user.isProvider,
      },
      provider: rating,
    });
    return;
  }
}
