import { Request, Response } from 'express';
import ListUsersService from '../services/ListUsersService';
import CreateUserService from '../services/CreateUserService';

export default class UsersControllers {
  async index(request: Request, response: Response): Promise<void> {
    const listUsersService = new ListUsersService();
    const users = await listUsersService.execute();
    response.json(users);
  }

  async create(request: Request, response: Response): Promise<void> {
    const { name, email, password } = request.body;
    const createUserService = new CreateUserService();
    const user = await createUserService.execute({
      name,
      email,
      password,
    });
    response.json(user);
  }
}
