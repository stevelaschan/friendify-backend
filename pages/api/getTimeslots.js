import { getTimeslotsByProviderUsername } from '../../util/database';

export default async function getProvidersHandler(request, response) {
  if (request.method === 'POST') {
    const timeslots = await getTimeslotsByProviderUsername(
      request.body.username,
    );
    // console.log(timeslots);

    response.json(timeslots);
    return;
  }
}
