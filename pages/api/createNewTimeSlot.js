import { createNewTimeslot, getProviderIdByUserId } from '../../util/database';

export default async function createNewTimeSlotHandler(request, response) {
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
