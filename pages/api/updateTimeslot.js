import { updateTimeslotWithUsername } from '../../util/database';

export default async function updateTimeslotHandler(request, response) {
  if (request.method === 'PUT') {
    const updateTimeslot = JSON.parse(request.body);
    const updatedTimeslot = await updateTimeslotWithUsername(
      updateTimeslot.username,
      updateTimeslot.providerId,
      updateTimeslot.time,
      updateTimeslot.date,
    );

    // console.log(updatedTimeslot);
    response.json(updatedTimeslot);
    return;
  }
}
