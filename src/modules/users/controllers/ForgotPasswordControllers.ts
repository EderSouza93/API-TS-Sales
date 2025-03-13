import { Request, Response } from 'express';
import SendForgotPasswordEmailService from '../services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  async create(request: Request, response: Response): Promise<void> {
    const { email } = request.body;

    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService();

    await sendForgotPasswordEmailService.execute({ email });

    response.status(204).json();
  }
}
