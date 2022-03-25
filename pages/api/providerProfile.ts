import { NextApiRequest, NextApiResponse } from 'next';
import {
  getProviderIdByUserId,
  getTimeslotsByUserId,
  getUserById,
} from '../../util/database';

type ProviderProfileRequestBody = {
  firstName: string;
  lastName: string;
  age: string;
  shortDescription: string;
};

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

    const providerProfile = await getUserById(userId);
    const providerId = await getProviderIdByUserId(userId);
    const providerTimeslots = await getTimeslotsByUserId(userId);
    // console.log('provider Id', providerId);
    response.json({
      profile: providerProfile,
      id: providerId,
      timeslots: providerTimeslots,
    });
    return;
  }
}
