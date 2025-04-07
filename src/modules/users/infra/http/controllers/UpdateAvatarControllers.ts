import { Request, Response } from 'express';
import UpdateUserAvatarService from '../../../services/UpdateUserAvatarService';

export default class UpdateAvatarControllers {
  async update(request: Request, response: Response): Promise<void> {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      userId: Number(request.user.id),
      avatarFilename: request.file?.filename as string,
    });

    response.json(user);
  }
}
