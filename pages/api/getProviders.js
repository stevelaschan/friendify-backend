import { getAllUsers, getRatingByUserId } from '../../util/database';

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

    const providerWithRatings = [];

    providers.forEach(async (provider) => {
      const ratings = await getRatingByUserId(provider.id);
      ratings.map((rating) => {
        if (provider.id === rating.providerId) {
          providerWithRatings[provider.id] = [...provider, rating];
        }
        return undefined;
      });
      return provider;
    });

    // console.log(providerWithRatings);

    response.json(providers);
    return;
  }
}
