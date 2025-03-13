import { Request, Response } from 'express';
import ResetPasswordService from '../services/ResetPasswordService';

export default class ResetPasswordController {
  async create(request: Request, response: Response): Promise<void> {
    const { password, token } = request.body;

    const resetPassword = new ResetPasswordService();

    await resetPassword.execute({ password, token });

    response.status(204).json();
  }
}
