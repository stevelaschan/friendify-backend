import {
  getUserByValidSessionToken,
  updateTimeslotWithUsername,
} from '../../util/database';
import { NextApiRequest, NextApiResponse } from 'next';

type UpdateTimeslotRequestBody = {
  userUsername: string;
  providerUsername: string;
  time: string;
  date: Date;
};

type UpdateTimeslotApiRequest = Omit<NextApiRequest, 'body'> & {
  body: UpdateTimeslotRequestBody;
};

type UpdateTimeslotResponseBody =
  | {}
  | { errors: { message: string }[] }
  | undefined;

export default async function updateTimeslotHandler(
  request: UpdateTimeslotApiRequest,
  response: NextApiResponse<UpdateTimeslotResponseBody>,
) {
  if (request.method === 'PUT') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      return;
    }
    const updatedTimeslot = await updateTimeslotWithUsername(
      request.body.userUsername,
      request.body.providerUsername,
      request.body.time,
      request.body.date,
    );

    response.status(200).json(updatedTimeslot);
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
