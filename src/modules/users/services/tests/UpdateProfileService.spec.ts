import 'reflect-metadata';
import { IUser } from '@modules/users/domain/models/IUser';
import { IUsersRepository } from '@modules/users/domain/repositories/IUserRepositories';
import AppError from '@shared/errors/AppError';

import { compare, hash } from 'bcrypt';
import UpdateProfileService from '../UpdateProfileService';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UpdateProfileService', () => {
  let usersRepository: jest.Mocked<IUsersRepository>;
  let updateProfileService: UpdateProfileService;

  const mockUser: IUser = {
    id: 1,
    name: 'João',
    email: 'joao@mail.com',
    password: 'hashed-old',
    created_at: new Date(),
    updated_at: new Date(),
    avatar: '',
    getAvatarUrl: function (): string | null {
      throw new Error('Function not implemented.');
    },
  };

  beforeEach(() => {
    usersRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    updateProfileService = new UpdateProfileService(usersRepository);
    jest.clearAllMocks();
  });

  it('should update name and email', async () => {
    usersRepository.findById.mockResolvedValue({ ...mockUser });
    usersRepository.findByEmail.mockResolvedValue(null);

    const updated = await updateProfileService.execute({
      user_id: 1,
      name: 'Novo Nome',
      email: 'novo@mail.com',
    });

    expect(updated.name).toBe('Novo Nome');
    expect(updated.email).toBe('novo@mail.com');
    expect(usersRepository.save).toHaveBeenCalled();
  });

  it('should throw if user does not exist', async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(
      updateProfileService.execute({
        user_id: 1,
        name: 'Teste',
        email: 'teste@mail.com',
      }),
    ).rejects.toEqual(new AppError('User not found.'));
  });

  it('should throw if email already exists', async () => {
    usersRepository.findById.mockResolvedValue({ ...mockUser });
    usersRepository.findByEmail.mockResolvedValue({ ...mockUser, id: 2 });

    await expect(
      updateProfileService.execute({
        user_id: 1,
        name: 'Outro',
        email: 'joao@mail.com',
      }),
    ).rejects.toEqual(
      new AppError('There is already one user with this email.', 409),
    );
  });

  it('should throw if trying to update password without old_password', async () => {
    usersRepository.findById.mockResolvedValue({ ...mockUser });
    usersRepository.findByEmail.mockResolvedValue(null);

    await expect(
      updateProfileService.execute({
        user_id: 1,
        name: 'João',
        email: 'joao@mail.com',
        password: 'novaSenha',
      }),
    ).rejects.toEqual(new AppError('Old password is required.'));
  });

  it('should throw if old password does not match', async () => {
    usersRepository.findById.mockResolvedValue({ ...mockUser });
    usersRepository.findByEmail.mockResolvedValue(null);
    (compare as jest.Mock).mockResolvedValue(false);

    await expect(
      updateProfileService.execute({
        user_id: 1,
        name: 'João',
        email: 'joao@mail.com',
        password: 'novaSenha',
        old_password: 'senhaErrada',
      }),
    ).rejects.toEqual(new AppError('Old password does not match.'));
  });

  it('should update password if old password matches', async () => {
    usersRepository.findById.mockResolvedValue({ ...mockUser });
    usersRepository.findByEmail.mockResolvedValue(null);
    (compare as jest.Mock).mockResolvedValue(true);
    (hash as jest.Mock).mockResolvedValue('novaSenhaHasheada');

    const result = await updateProfileService.execute({
      user_id: 1,
      name: 'João',
      email: 'joao@mail.com',
      password: 'novaSenha',
      old_password: 'senhaCorreta',
    });

    expect(result.password).toBe('novaSenhaHasheada');
    expect(usersRepository.save).toHaveBeenCalled();
  });
});
