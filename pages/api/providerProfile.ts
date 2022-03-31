import { NextApiRequest, NextApiResponse } from 'next';
import {
  getRatingByUserId,
  getTimeslotsByProviderUsername,
  getUserById,
  Rating,
  Timeslot,
} from '../../util/database';

type ProviderProfileRequestBody = string;

type ProviderProfileResponseBody = {
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
};

type ProviderProfileNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: ProviderProfileRequestBody;
};

export default async function getRestrictedProfile(
  request: ProviderProfileNextApiRequest,
  response: NextApiResponse<ProviderProfileResponseBody>,
) {
  if (request.method === 'POST') {
    const userId = JSON.parse(request.body).id;
    const username = JSON.parse(request.body).username;

    const providerProfile = await getUserById(userId);
    const providerTimeslots = await getTimeslotsByProviderUsername(username);
    const ratings = await getRatingByUserId(userId);
    const ratingArray = ratings.map((rating: Rating) => rating.rating);
    const averageRating =
      ratingArray.reduce((a: number, c: number) => a + c, 0) / ratings.length;

    response.json({
      profile: providerProfile,
      timeslots: providerTimeslots,
      rating: averageRating,
    });
    return;
  }
}
