import { Request, Response } from 'express';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

export default class UpdateAvatarControllers {
  async update(request: Request, response: Response): Promise<void> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      userId: Number(request.user.id),
      avatarFileName: request.file?.filename as string,
    });

    response.json(instanceToInstance(user));
  }
}
