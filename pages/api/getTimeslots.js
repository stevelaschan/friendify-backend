import { getTimeslotsByUsername } from '../../util/database';

export default async function getUserTimeslotsHandler(request, response) {
  if (request.method === 'POST') {
    const timeslotByUsername = await getTimeslotsByUsername(
      JSON.parse(request.body).username,
    );

    const newState = {};

    timeslotByUsername.forEach((timeslot) => {
      const date = timeslot.timeslotDate.toISOString().split('T')[0];

      // console.log('newState', newState[date]);
      newState[date] = newState[date]
        ? [...newState[date], timeslot]
        : [timeslot];
    });

    response.status(200).json(newState);
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
