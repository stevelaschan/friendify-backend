import {
  createNewTimeslot,
  getUserByValidSessionToken,
  Timeslot,
} from '../../util/database';
import { NextApiRequest, NextApiResponse } from 'next';

type NewTimeslot = {
  username: string;
  date: Date;
  time: string;
};

type CreateTimeslotNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: NewTimeslot;
};

type CreateTimeslotResponseBody =
  | Timeslot
  | { errors: { message: string }[] }
  | undefined;

export default async function createNewTimeSlotHandler(
  request: CreateTimeslotNextApiRequest,
  response: NextApiResponse<CreateTimeslotResponseBody>,
) {
  if (request.method === 'POST') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      return;
    }
    const newTimeslot = await createNewTimeslot(
      request.body.username,
      request.body.date,
      request.body.time,
    );
    response.status(200).json(newTimeslot);
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
