import { getUserByValidSessionToken } from '../../util/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function protectedUserHandler(request: protectsUserNextApiRequest, response: NextApiResponse<protectedUserResponseBody>) {
  if(request.method === "GET") {
    const token = request.cookies.sessionToken;
    const user = await getUserByValidSessionToken(token);
    console.log(user)
    response.json({user: {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      username: user.username
      },
    })
    return
  }
}