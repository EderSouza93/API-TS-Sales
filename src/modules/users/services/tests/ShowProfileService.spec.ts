import 'reflect-metadata';
import { IUser } from '@modules/users/domain/models/IUser';
import { IUsersRepository } from '@modules/users/domain/repositories/IUserRepositories';
import AppError from '@shared/errors/AppError';
import ShowProfileService from '../ShowProfileService';

describe('ShowProfileService', () => {
  let usersRepository: jest.Mocked<IUsersRepository>;
  let showProfileService: ShowProfileService;

  beforeEach(() => {
    usersRepository = {
      findAll: jest.fn(),
      findByName: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    showProfileService = new ShowProfileService(usersRepository);
  });

  it('should return the user profile if user exists', async () => {
    const mockUser: IUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: '',
      getAvatarUrl: function (): string | null {
        throw new Error('Function not implemented.');
      },
    };

    usersRepository.findById.mockResolvedValue(mockUser);

    const result = await showProfileService.execute({ user_id: 1 });

    expect(result).toEqual(mockUser);
    expect(usersRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw an AppError if user does not exists', async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(showProfileService.execute({ user_id: 999 })).rejects.toEqual(
      new AppError('User not found.', 404),
    );
  });
});
