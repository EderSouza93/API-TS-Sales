import { Request, Response } from 'express';
import ListUsersService from '@modules/users/services/ListUsersService';
import CreateUserService from '@modules/users/services/CreateUserService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

export default class UsersControllers {
  async index(request: Request, response: Response): Promise<void> {
    const { page, skip, take } = request.query;

    const listUser = container.resolve(ListUsersService);

    const users = await listUser.execute({
      page: Number(page),
      skip: Number(skip),
      take: Number(take),
    });

    response.json(instanceToInstance(users));
  }

  async create(request: Request, response: Response): Promise<void> {
    const { name, email, password } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      name,
      email,
      password,
    });
    response.json(instanceToInstance(user));
  }
}
