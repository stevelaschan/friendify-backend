import { getAllUsers } from '../../util/database';

export default async function getUsersHandler(request: LogoutNextApiRequest, response: NextApiResponse<LogoutResponseBody>) {
  if (request.method === 'GET') {
    getUsers = await getAllUsers()
    console.log(getUsers)
    response
      .json({users: getUser});
    return;
  }
}