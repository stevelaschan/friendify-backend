import { getAllUsers } from '../../util/database';

export default async function getUsersHandler(request: LogoutNextApiRequest, response: NextApiResponse<LogoutResponseBody>) {
  if (request.method === 'GET') {
    const getUsers = await getAllUsers()
    console.log(getUsers)
    response
      .json(getUsers);
    return;
  }
}