// export default async function getUsersHandler(
//   request: getUsersNextApiRequest,
//   response: NextApiResponse<User[]>,
// ) {
//   if (request.method === 'GET') {
//     const users = await getAllUsers();
//     const provider = async () => {
//       for (const user of users) {
//         const rating = await getRatingByUserId(user.id);
//         // console.log(rating);
//       }
//     };
//     await provider();
//     // const providerRating = await provider();
//     // console.log(providerRating);
//     response.json(users);
//     return;
//   }
// }
