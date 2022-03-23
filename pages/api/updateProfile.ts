import { NextApiRequest, NextApiResponse } from 'next';
import { createProvider, updateUserByUsername } from '../../util/database';

type UpdateProfileRequestBody = {
  firstName: string;
  lastName: string;
  age: string;
  shortDescription: string;
};

type UpdateProfileResponseBody =
  | {
      id: number;
      username: string;
      firstName: string;
      lastName: string;
      age: string;
      shortDescription: string;
      isProvider: boolean;
    }
  | undefined;

type UpdateProfileNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: UpdateProfileRequestBody;
};

export default async function updateUserHandler(
  request: UpdateProfileNextApiRequest,
  response: NextApiResponse<UpdateProfileResponseBody>,
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

    (await userUpdateRequest.isProvider) &&
      createProvider(userUpdateRequest.id);

    // console.log(updateUser);
    response.json(updateUser);
    return;
  }
}
