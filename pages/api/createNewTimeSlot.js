import { createNewTimeslot } from '../../util/database';

export default async function createNewTimeSlotHandler(request, response) {
  if (request.method === 'POST') {
    const provider = JSON.parse(request.body);

    const newTimeslot = await createNewTimeslot(
      provider.username,
      provider.date,
      provider.time,
    );
    // console.log(newTimeslot);
    response.status(200).json(newTimeslot);
    return;
  }
}
