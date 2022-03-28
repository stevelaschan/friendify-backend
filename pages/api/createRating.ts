import { NextApiRequest, NextApiResponse } from 'next';
import { createRating } from '../../util/database';

type CreateRating = {
  id: number;
  userId: number;
  providerId: number;
  rating: number;
};

type CreateRatingNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: string;
};

type CreateRatingResponseBody = CreateRating | undefined;

export default async function updateUserHandler(
  request: CreateRatingNextApiRequest,
  response: NextApiResponse<CreateRatingResponseBody>,
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
