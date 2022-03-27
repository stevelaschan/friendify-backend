import { NextApiRequest, NextApiResponse } from 'next';
import {
  getRatingByUserId,
  getTimeslotsByUserId,
  getUserByValidSessionToken,
  Rating,
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
  | { user: User; provider: Rating }
  | undefined;

export default async function protectedUserHandler(
  request: ProtectedUserNextApiRequest,
  response: NextApiResponse<ProtectedUserResponseBody>,
) {
  if (request.method === 'GET') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      response.status(404).json({
        error: 'User or Session not found',
      });
      return;
    }

    const ratings = await getRatingByUserId(user.id);
    const addedRatings = ratings.reduce((a, c) => a + c, 0);
    const averageRating = addedRatings / (ratings.length - 1);
    const timeslots = await getTimeslotsByUserId(user.id);

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
      provider: averageRating,
      timeslots: timeslots,
    });
    return;
  }
}
