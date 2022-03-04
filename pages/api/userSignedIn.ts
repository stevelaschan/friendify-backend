import { NextApiRequest, NextApiResponse } from 'next';
import {getValidSessionByToken} from '../../util/database';

type LogoutNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: LogoutRequestBody;
};


export default async function userSignedInHandler(request: LogoutNextApiRequest, response: NextApiResponse<LogoutResponseBody>) {
  if (request.method === 'GET') {

    const token = request.cookies.sessionToken;
    const session = await getValidSessionByToken(token);
    console.log(session)
      response
      .status(201)
      .json({session : session})
      return
  }
}