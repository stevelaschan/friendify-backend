import { createNewTimeslot } from '../../util/database';

export default async function createNewTimeSlotHandler(request, response) {
  if (request.method === 'POST') {
    const user = JSON.parse(request.body);
    const newTimeslot = await createNewTimeslot(user.id, user.date, user.time);
    console.log(newTimeslot);
    response.json(newTimeslot);
    return;
  }
}
