import {
  deleteTimeslot,
  getUserByValidSessionToken,
} from '../../util/database';
import { NextApiRequest, NextApiResponse } from 'next';

type DeleteTimeslot = {};

type DeleteTimeslotBody = {
  username: string;
  date: Date;
  time: string;
};

type DeleteTimeslotNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: DeleteTimeslotBody;
};

type DeleteTimeslotResponseBody =
  | DeleteTimeslot
  | { errors: { message: string }[] }
  | undefined;

export default async function LogoutHandler(
  request: DeleteTimeslotNextApiRequest,
  response: NextApiResponse<DeleteTimeslotResponseBody>,
) {
  if (request.method === 'DELETE') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      return;
    }
    const timeslot = await deleteTimeslot(
      request.body.username,
      request.body.date,
      request.body.time,
    );
    response.status(200).json(timeslot);
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
