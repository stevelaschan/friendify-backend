import { NextApiRequest, NextApiResponse } from 'next';
import {
  getRatingByUserId,
  getTimeslotsByProviderUsername,
  getUserById,
  getUserByValidSessionToken,
  Rating,
  Timeslot,
} from '../../util/database';

type ProviderProfileRequestBody = {
  id: number;
  username: string;
};

type ProviderProfileResponseBody =
  | {
      profile:
        | {
            id: number;
            username: string;
            firstName: string;
            lastName: string;
            age: string;
            shortDescription: string;
            isProvider: boolean;
          }
        | undefined;
      timeslots: Timeslot[] | undefined;
      rating: number;
    }
  | { errors: { message: string }[] };

type ProviderProfileNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: ProviderProfileRequestBody;
};

export default async function getRestrictedProfile(
  request: ProviderProfileNextApiRequest,
  response: NextApiResponse<ProviderProfileResponseBody>,
) {
  if (request.method === 'POST') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      return;
    }
    const providerProfile = await getUserById(request.body.id);
    const providerTimeslots = await getTimeslotsByProviderUsername(
      request.body.username,
    );
    const ratings = await getRatingByUserId(request.body.id);
    const ratingArray = ratings.map((rating: Rating) => rating.rating);
    const averageRating =
      ratingArray.reduce((a: number, c: number) => a + c, 0) / ratings.length;

    response.status(200).json({
      profile: providerProfile,
      timeslots: providerTimeslots,
      rating: averageRating,
    });
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
