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

    // for (const provider of providers) {
    //   const allRatings = await getRatingByUserId(provider.id);
    //   allRatings.map((rating) => {
    //     if (rating.providerId === provider.id) {
    //       ratings[provider.id] = ratings[provider.id]
    //         ? [...ratings[provider.id], rating]
    //         : [rating];
    //     }
    //     return ratings
    //   });
    // }

    const ratings = await getAllRatings();

    response.json({ providers: providers, ratings: ratings });
    return;
  }
}
