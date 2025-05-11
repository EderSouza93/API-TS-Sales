import FakeUserRepository from '@modules/users/domain/repositories/fakes/FakeUserRepositories';
import FakeUserTokenRepository from '@modules/users/domain/repositories/fakes/FakeUserTokensRepositories';
import AppError from '@shared/errors/AppError';
import { addHours } from 'date-fns';
import ResetPasswordService from '../ResetPasswordService';

// Mock do bcrypt para não precisar fazer hash real durante os testes
jest.mock('bcrypt', () => {
  return {
    hash: jest.fn().mockImplementation(password => {
      return Promise.resolve(`hashed-${password}`);
    }),
  };
});

describe('ResetPasswordService', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeUserTokensRepository: FakeUserTokenRepository;
  let resetPasswordService: ResetPasswordService;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokenRepository();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to reset password', async () => {
    // Criar um usuário
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // Gerar token de reset
    const { token } = await fakeUserTokensRepository.generate(user.id);

    // Executar o serviço de reset de senha
    await resetPasswordService.execute({
      token,
      password: 'new-password',
    });

    // Verificar se o usuário foi atualizado com a nova senha
    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(updatedUser).toBeDefined();
    expect(updatedUser?.password).toBe('hashed-new-password');
  });

  it('should not be able to reset password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(999);

    await expect(
      resetPasswordService.execute({
        token,
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if token is expired', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const tokenDate = new Date();
      return addHours(tokenDate, 3).getTime();
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
