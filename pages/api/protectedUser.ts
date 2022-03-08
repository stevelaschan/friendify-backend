import { getUserByValidSessionToken, getValidSessionByToken } from '../../util/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function protectedUserHandler(request: protectsUserNextApiRequest, response: NextApiResponse<protectedUserResponseBody>) {
  if(request.method === "GET") {
    const token = request.cookies.sessionToken;
    // get user from session token
    const user = await getUserByValidSessionToken(token);
    // get valid session token
    const session = await getValidSessionByToken (token)
    // console.log("user", user)
    // console.log("session", session)

    if (!user) {
      response.status(404).json({
        error: "User or Session not found"
      }
      )
      return
    }

    response.json({user: {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      username: user.username
      },
      session: session
    })
    return
  }
}