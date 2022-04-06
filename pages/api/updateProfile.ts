import { NextApiRequest, NextApiResponse } from 'next';
import {
  getUserByValidSessionToken,
  updateUserByUsername,
} from '../../util/database';

type UpdateProfileRequestBody = {
  username: string;
  firstName: string;
  lastName: string;
  age: string;
  shortDescription: string;
  isProvider: boolean;
};

type UpdateProfileResponseBody =
  | {
      id: number;
      username: string;
      firstName: string;
      lastName: string;
      age: string;
      shortDescription: string;
      isProvider: boolean;
    }
  | { errors: { message: string }[] }
  | undefined;

type UpdateProfileNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: UpdateProfileRequestBody;
};

export default async function updateUserHandler(
  request: UpdateProfileNextApiRequest,
  response: NextApiResponse<UpdateProfileResponseBody>,
) {
  if (request.method === 'PUT') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      return;
    }
    const updateUser = await updateUserByUsername(
      request.body.username,
      request.body.firstName,
      request.body.lastName,
      request.body.age,
      request.body.shortDescription,
      request.body.isProvider,
    );

    response.status(200).json(updateUser);
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
