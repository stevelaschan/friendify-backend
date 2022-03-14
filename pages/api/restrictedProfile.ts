import {getUserByUsername} from '../../util/database';

export default async function getRestrictedProfile(request: LogoutNextApiRequest, response: NextApiResponse<LogoutResponseBody>) {
  if (request.method === 'POST') {
    const username = JSON.parse(request.body).username
    const userProfile = await getUserByUsername(username)
    response
      .json(userProfile);
    return;
  }
}