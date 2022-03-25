import { deleteTimeslot, getProviderIdByUserId } from '../../util/database';

export default async function LogoutHandler(request, response) {
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
