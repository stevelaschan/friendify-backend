import { NextApiRequest, NextApiResponse } from 'next';
import { createRating } from '../../util/database';
import { SignupResponseBody } from './signup';

type CreateRating = {
  userId: number;
  providerId: number;
  rating: number;
};

type CreateRatingNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: CreateRating;
};

export default async function updateUserHandler(
  request: CreateRatingNextApiRequest,
  response: NextApiResponse<SignupResponseBody>,
) {
  if (request.method === 'POST') {
    const userId = JSON.parse(request.body).userId;
    const providerId = JSON.parse(request.body).providerId;
    const rating = JSON.parse(request.body).rating;
    const setRating = await createRating(userId, providerId, rating);
    // console.log(setRating);
    response.json(setRating);
    return;
  }
}
