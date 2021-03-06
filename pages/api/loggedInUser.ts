import { NextApiRequest, NextApiResponse } from 'next';
import {
  getRatingByUserId,
  getTimeslotsByUsername,
  getUserByValidSessionToken,
  Rating,
  Timeslot,
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
  | { user: User; rating: number; timeslots: Timeslot[] }
  | { errors: { message: string }[] }
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
    const ratingArray = ratings.map((rating: Rating) => rating.rating);
    const averageRating =
      ratingArray.reduce((a: number, c: number) => a + c, 0) / ratings.length;

    const timeslots = await getTimeslotsByUsername(user.username);

    response.status(200).json({
      user: user,
      rating: averageRating,
      timeslots: timeslots,
    });
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
