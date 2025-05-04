import { Request, Response } from 'express';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import { container } from 'tsyringe';

export default class ResetPasswordController {
  async create(request: Request, response: Response): Promise<void> {
    const { password, token } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({ password, token });

    response.status(204).json();
  }
}
