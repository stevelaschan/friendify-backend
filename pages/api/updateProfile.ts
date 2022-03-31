import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserByUsername } from '../../util/database';

type UpdateProfileRequestBody = string;

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
  | { errors: { message: string }[] }
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
    const updateUser = await updateUserByUsername(
      userUpdateRequest.username,
      userUpdateRequest.firstName,
      userUpdateRequest.lastName,
      userUpdateRequest.age,
      userUpdateRequest.shortDescription,
      userUpdateRequest.isProvider,
    );

    response.status(200).json(updateUser);
    return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
