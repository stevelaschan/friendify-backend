import { deleteTimeslot } from '../../util/database';

export default async function LogoutHandler(request, response) {
  if (request.method === 'DELETE') {
    // console.log(request.body);
    const user = JSON.parse(request.body);
    const timeslot = await deleteTimeslot(user.username, user.date, user.time);
    response.status(200).json(timeslot);
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
