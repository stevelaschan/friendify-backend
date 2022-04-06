import { NextApiRequest, NextApiResponse } from 'next';
import {
  createRating,
  getUserByValidSessionToken,
  getUserIdByUsername,
} from '../../util/database';

type CreateRating = {
  id: number;
  userId: number;
  providerId: number;
  rating: number;
};

type CreateRatingBody = {
  userId: number;
  providerUsername: string;
  rating: number;
};

type CreateRatingNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: CreateRatingBody;
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
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      return;
    }
    const providerUsername = request.body.providerUsername;
    const providerId = await getUserIdByUsername(providerUsername);

    const setRating = await createRating(
      request.body.userId,
      providerId.id,
      request.body.rating,
    );
    response.status(200).json(setRating);
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
