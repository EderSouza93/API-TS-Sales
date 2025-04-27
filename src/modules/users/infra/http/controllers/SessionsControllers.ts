import { Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import CreateSessionsService from '@modules/users/services/CreateSessionService';
import { container } from 'tsyringe';

export default class SessionsController {
  async create(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;

    const createSession = container.resolve(CreateSessionsService);

    const user = await createSession.execute({
      email,
      password,
    });

    response.json(instanceToInstance(user));
  }
}
