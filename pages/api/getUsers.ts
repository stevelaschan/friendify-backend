import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllUsers,
  getUserByValidSessionToken,
  User,
} from '../../util/database';

type UserNextApiRequest = Omit<NextApiRequest, 'body'>;

export default async function getUsersHandler(
  request: UserNextApiRequest,
  response: NextApiResponse<
    { users: User[] } | { errors: { message: string }[] }
  >,
) {
  if (request.method === 'GET') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      return;
    }
    const users = await getAllUsers();

    response.status(200).json({ users: users });
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
