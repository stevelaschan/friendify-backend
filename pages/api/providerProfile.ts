import { NextApiRequest, NextApiResponse } from 'next';
import {
  getRatingByUserId,
  getTimeslotsByUserId,
  getUserById,
  Rating,
  Timeslot,
} from '../../util/database';

type ProviderProfileRequestBody = string;

type ProviderProfileResponseBody = {
  profile:
    | {
        username: string;
        firstName: string;
        lastName: string;
        age: string;
        shortDescription: string;
        isProvider: boolean;
      }
    | undefined;
  id:
    | {
        id: number;
        userId: number;
      }
    | undefined;
  timeslots: Timeslot[];
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
    // const userId = request.body.id;
    console.log(request.body);

    const providerProfile = await getUserById(userId);
    const providerTimeslots = await getTimeslotsByUserId(userId);
    const ratings = await getRatingByUserId(userId);
    const ratingArray = ratings.map((rating: Rating) => rating.rating);
    const averageRating =
      ratingArray.reduce((a: number, c: number) => a + c, 0) / ratings.length;

    // console.log('provider Id', providerTimeslots);
    response.json({
      profile: providerProfile,
      timeslots: providerTimeslots,
      rating: averageRating,
    });
    return;
  }
}
