import { getAllRatings, getAllUsers } from '../../util/database';

export default async function getProvidersHandler(request, response) {
  if (request.method === 'GET') {
    const providers = [];
    const users = await getAllUsers();

    users.map((user) => {
      if (user.isProvider) {
        providers.push(user);
      }
      return providers;
    });

    const ratings = await getAllRatings();

    response.status(200).json({ providers: providers, ratings: ratings });
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
