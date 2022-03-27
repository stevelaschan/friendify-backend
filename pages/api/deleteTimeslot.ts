import { NextApiRequest, NextApiResponse } from 'next';
import { deleteTimeslot, getProviderIdByUserId } from '../../util/database';

type DeleteTimeslotRequestBody = {
  id: number;
  date: string;
  time: string;
};

type DeletedTimeslot = {};

type DeleteTimeslotNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: DeleteTimeslotRequestBody;
};

export default async function LogoutHandler(
  request: DeleteTimeslotNextApiRequest,
  response: NextApiResponse<DeletedTimeslot>,
) {
  if (request.method === 'DELETE') {
    console.log(request.body);
    const user = JSON.parse(request.body);
    const provider = await getProviderIdByUserId(user.id);
    const timeslot = await deleteTimeslot(provider.id, user.date, user.time);
    response.json(timeslot);
    // console.log(timeslot);
  }
  return;
}
