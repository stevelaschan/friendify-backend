import { updateTimeslotWithUsername } from '../../util/database';

export default async function updateTimeslotHandler(request) {
  if (request.method === 'PUT') {
    const updateTimeslot = JSON.parse(request.body);
    await updateTimeslotWithUsername(
      updateTimeslot.username,
      updateTimeslot.providerId,
      updateTimeslot.time,
      updateTimeslot.date,
    );

    // console.log(updatedTimeslot);
    // response.json(updateUser);
    return;
  }
}
