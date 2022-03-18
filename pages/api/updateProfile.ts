import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserByUsername } from '../../util/database';
import { SignupResponseBody } from './signup';

type UpdateProfileRequestBody = {
  firstName: string;
  lastName: string;
  age: string;
  shortDescription: string;
};

type UpdateProfileNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: UpdateProfileRequestBody;
};

export default async function updateUserHandler(
  request: UpdateProfileNextApiRequest,
  response: NextApiResponse<SignupResponseBody>,
) {
  if (request.method === 'PUT') {
    const userUpdateRequest = JSON.parse(request.body);
    // console.log(userUpdateRequest);
    const updateUser = await updateUserByUsername(
      userUpdateRequest.username,
      userUpdateRequest.firstName,
      userUpdateRequest.lastName,
      userUpdateRequest.age,
      userUpdateRequest.shortDescription,
      userUpdateRequest.isProvider,
    );

    // console.log(updateUser);
    response.json(updateUser);
    return;
  }
}
