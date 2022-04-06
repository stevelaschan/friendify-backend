import {
  getTimeslotsByUsername,
  getUserByValidSessionToken,
} from '../../util/database';

export default async function getUserTimeslotsHandler(request, response) {
  if (request.method === 'POST') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      return;
    }
    const timeslotByUsername = await getTimeslotsByUsername(
      request.body.username,
    );

    const newState = {};

    timeslotByUsername.forEach((timeslot) => {
      const date = timeslot.timeslotDate.toISOString().split('T')[0];

      newState[date] = newState[date]
        ? [...newState[date], timeslot]
        : [timeslot];
    });

    response.status(200).json(newState);
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
