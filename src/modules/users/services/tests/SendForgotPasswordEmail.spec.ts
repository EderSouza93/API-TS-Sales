/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { sendEmail } from '@config/email';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from '../SendForgotPasswordEmailService';

const mockUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
};

const mockToken = {
  token: 'generate-token',
};

const mockUsersRepository = {
  findByEmail: jest.fn(),
};

const mockUserTokensRepository = {
  generate: jest.fn(),
};

jest.mock('@config/email', () => ({
  sendEmail: jest.fn(),
}));

describe('SendForgotPasswordEmailService', () => {
  let service: SendForgotPasswordEmailService;

  beforeEach(() => {
    service = new SendForgotPasswordEmailService(
      mockUsersRepository as any,
      mockUserTokensRepository as any,
    );

    jest.clearAllMocks();
  });

  it('should be to throw an error if the user is not found', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    await expect(
      service.execute({ email: 'notfound@example.com ' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be to generate an token and send an email to existents user', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
    mockUserTokensRepository.generate.mockResolvedValue(mockToken);

    await service.execute({ email: mockUser.email });

    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
      mockUser.email,
    );
    expect(mockUserTokensRepository.generate).toHaveBeenCalledWith(mockUser.id);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: mockUser.email,
        subject: expect.any(String),
        body: expect.stringContaining(mockToken.token),
      }),
    );
  });

  it('should handle missing token gracefully', async () => {
    const user = {
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
    };

    mockUsersRepository.findByEmail.mockResolvedValue(user);
    mockUserTokensRepository.generate.mockResolvedValue(undefined); // <- ponto chave

    await expect(
      service.execute({ email: user.email }),
    ).resolves.toBeUndefined();

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('undefined'),
      }),
    );
  });
});
