import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllUsers,
  getProviderIdByUserId,
  getRatingByProviderId,
  getRatingByUserId,
} from '../../util/database';

type Provider = {
  id: number;
  username: string;
  age: string;
  shortDescription: string;
  isProvider: boolean;
};

export default async function getUsersHandler(request, response) {
  if (request.method === 'GET') {
    const users = await getAllUsers();
    const provider = async () => {
      for (const user of users) {
        const rating = await getRatingByUserId(user.id);
        // console.log(rating);
      }
    };
    await provider();
    // const providerRating = await provider();
    // console.log(providerRating);
    response.json(users);
    return;
  }
}
