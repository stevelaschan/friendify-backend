import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllUsers,
  getProviderIdsByUserIds,
  getRatingByProviderId,
} from '../../util/database';

type RestrictedUser = {
  id: number;
  username: string;
  age: string;
  shortDescription: string;
  isProvider: boolean;
};

export default async function getUsersHandler(request, response) {
  if (request.method === 'GET') {
    const users = await getAllUsers();
    // const provider = await getProviderIdByUserId(user.id);
    // const ratings = await getRatingByProviderId(provider.id);
    const providerId = await getProviderIdsByUserIds(users.id);
    console.log(providerId);
    response.json(users);
    return;
  }
}
