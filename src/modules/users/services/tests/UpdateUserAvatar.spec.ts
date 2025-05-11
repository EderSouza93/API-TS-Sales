/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import UpdateUserAvatarService from '../UpdateUserAvatarService';
import { User } from '@modules/users/infra/database/entities/User';

const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  avatar: '',
  created_at: new Date(),
  updated_at: new Date(),
  getAvatarUrl: function (): string | null {
    throw new Error('Function not implemented.');
  },
};

const usersRepository = {
  findById: jest.fn(),
  save: jest.fn(),
} as any;

let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    updateUserAvatarService = new UpdateUserAvatarService(usersRepository);
    jest.clearAllMocks();
  });

  it('should throw error if user is not found', async () => {
    usersRepository.findById.mockResolvedValue(undefined);

    await expect(
      updateUserAvatarService.execute({
        userId: 1,
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should update avatar if user has no previous avatar', async () => {
    usersRepository.findById.mockResolvedValue({ ...mockUser });
    usersRepository.save.mockResolvedValue({
      ...mockUser,
      avatar: 'new-avatar.jpg',
    });

    const result = await updateUserAvatarService.execute({
      userId: 1,
      avatarFileName: 'new-avatar.jpg',
    });

    expect(result.avatar).toBe('new-avatar.jpg');
  });

  it('should delete the old avatar if it exists', async () => {
    const userWithOldAvatar = { ...mockUser, avatar: 'old-avatar.jpg' };

    usersRepository.findById.mockResolvedValue(userWithOldAvatar);
    usersRepository.save.mockResolvedValue({
      ...userWithOldAvatar,
      avatar: 'new-avatar.jpg',
    });

    const statSpy = jest
      .spyOn(fs.promises, 'stat')
      .mockResolvedValue(undefined as any);
    const unlinkSpy = jest
      .spyOn(fs.promises, 'unlink')
      .mockResolvedValue(undefined);

    const result = await updateUserAvatarService.execute({
      userId: 1,
      avatarFileName: 'new-avatar.jpg',
    });

    const filePath = path.join(uploadConfig.directory, 'old-avatar.jpg');
    expect(statSpy).toHaveBeenCalledWith(filePath);
    expect(unlinkSpy).toHaveBeenCalledWith(filePath);
    expect(result.avatar).toBe('new-avatar.jpg');
  });

  it('should handle error if avatar file does not exist when trying to delete', async () => {
    const userWithOldAvatar = { ...mockUser, avatar: 'missing-avatar.jpg' };

    usersRepository.findById.mockResolvedValue(userWithOldAvatar);
    usersRepository.save.mockResolvedValue({
      ...userWithOldAvatar,
      avatar: 'new-avatar.jpg',
    });

    const statSpy = jest
      .spyOn(fs.promises, 'stat')
      .mockRejectedValue(new Error('stat error'));
    const unlinkSpy = jest.spyOn(fs.promises, 'unlink').mockImplementation();

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await updateUserAvatarService.execute({
      userId: 1,
      avatarFileName: 'new-avatar.jpg',
    });

    expect(statSpy).toHaveBeenCalled();
    expect(unlinkSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result.avatar).toBe('new-avatar.jpg');

    consoleSpy.mockRestore();
  });

  it('should update avatar when user has no avatar (null)', async () => {
    const userWithoutAvatar = { ...mockUser, avatar: null };

    usersRepository.findById.mockResolvedValue(userWithoutAvatar);
    usersRepository.save.mockResolvedValue({
      ...userWithoutAvatar,
      avatar: 'new-avatar.jpg',
    });

    const result = await updateUserAvatarService.execute({
      userId: 1,
      avatarFileName: 'new-avatar.jpg',
    });

    expect(result.avatar).toBe('new-avatar.jpg');
  });
});
