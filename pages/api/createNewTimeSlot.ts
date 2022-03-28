import { NextApiRequest, NextApiResponse } from 'next';
import {
  createNewTimeslot,
  getProviderIdByUserId,
  Timeslot,
} from '../../util/database';

type CreateNewTimeslotNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: string;
};

type CreateNewTimeslotResponse = Timeslot;

export default async function createNewTimeSlotHandler(
  request: CreateNewTimeslotNextApiRequest,
  response: NextApiResponse<CreateNewTimeslotResponse>,
) {
  if (request.method === 'POST') {
    const user = JSON.parse(request.body);
    const provider = await getProviderIdByUserId(user.id);
    const newTimeslot = await createNewTimeslot(
      provider.id,
      user.date,
      user.time,
    );
    console.log(newTimeslot);
    response.json(newTimeslot);
    return;
  }
}
