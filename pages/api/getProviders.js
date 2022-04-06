import {
  getAllRatings,
  getAllUsers,
  getUserByValidSessionToken,
} from '../../util/database';

export default async function getProvidersHandler(request, response) {
  if (request.method === 'GET') {
    const token = request.cookies.sessionToken;
    // get user from session token
    const validSessionUser = await getUserByValidSessionToken(token);

    if (!validSessionUser) {
      return;
    }
    const providers = [];
    const users = await getAllUsers();

    users.map((user) => {
      if (user.isProvider) {
        providers.push(user);
      }
      return providers;
    });

    const allProviderRatings = await getAllRatings();

    response
      .status(200)
      .json({ providers: providers, allProviderRatings: allProviderRatings });
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
