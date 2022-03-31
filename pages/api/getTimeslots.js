import { getTimeslots } from '../../util/database';

export default async function getUserTimeslotsHandler(request, response) {
  if (request.method === 'GET') {
    const timeslots = await getTimeslots();

    // console.log(timeslots);
    response.json(timeslots);
    return;
  }
}
