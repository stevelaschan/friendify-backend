import { getTimeslots } from '../../util/database';

export default async function getUserTimeslotsHandler(request, response) {
  if (request.method === 'GET') {
    const timeslots = await getTimeslots();

    // console.log(timeslots);
    response.status(200).json(timeslots);
    return;
  }
}
