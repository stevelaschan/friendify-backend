import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteSessionByToken } from '../../util/database';

type LogoutRequestBody = {
  username: string;
  password: string;
};

type LogoutNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: LogoutRequestBody;
};

type LogoutResponseBody = {};

export default async function LogoutHandler(
  request: LogoutNextApiRequest,
  response: NextApiResponse<LogoutResponseBody>,
) {
  if (request.method === 'DELETE') {
    // 1. get the cookie from  the session token
    const token = request.cookies.sessionToken;

    // 2. delete the session from our database
    await deleteSessionByToken(token);

    // 3. set the cookie to destruct
    response
      .setHeader(
        'Set-Cookie',
        serialize('sessionToken', '', {
          maxAge: -1,
          path: '/',
        }),
      )
      .send();
  }
  return;
}
