import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllProviders,
  getAllRatings,
  getAllUsers,
  User,
} from '../../util/database';

type getUsersNextApiRequest = Omit<NextApiRequest, 'body'>;

type ProviderRatings = {
  providerId: number;
  rating: number;
};

type ProviderIds = {
  id: number;
  userId: number;
};

export default async function getUsersHandler(
  request: getUsersNextApiRequest,
  response: NextApiResponse<{users: User[]}>,
) {
  if (request.method === 'GET') {
    const users = await getAllUsers();
    // const providerRatings = async () => {
    //   for (const user of users) {
    //     const ratings = await getRatingByUserId(user.id);
    //     console.log(ratings);
    //     return ratings;
    //   }
    // };

    const providerRatings = await getAllRatings();
    const providerIds = await getAllProviders();

    users.forEach((user) => {});

    // console.log(providerIds);

    response.json({ users: users });
    return;
  }
}
