import { NextApiRequest, NextApiResponse } from 'next';
import { createRating, getUserIdByUsername } from '../../util/database';

type CreateRating = {
  id: number;
  userId: number;
  providerId: number;
  rating: number;
};

type CreateRatingNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: string;
};

type CreateRatingResponseBody =
  | CreateRating
  | { errors: { message: string }[] }
  | undefined;

export default async function updateUserHandler(
  request: CreateRatingNextApiRequest,
  response: NextApiResponse<CreateRatingResponseBody>,
) {
  if (request.method === 'POST') {
    const userId = JSON.parse(request.body).userId;
    const providerUsername = JSON.parse(request.body).providerUsername;
    const providerId = await getUserIdByUsername(providerUsername);
    const rating = JSON.parse(request.body).rating;

    const setRating = await createRating(userId, providerId.id, rating);
    response.status(200).json(setRating);
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
