import 'reflect-metadata';
import FakeUserRepository from '../domain/repositories/fakes/FakeUserRepositories';
import CreateUserService from './CreateUserService';
import { hash } from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

let fakeUserRepository: FakeUserRepository;
let createUserService: CreateUserService;
describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    createUserService = new CreateUserService(fakeUserRepository);
  });
  it('should be able to create a new user', async () => {
    (hash as jest.Mock).mockReturnValue('hashed-password');

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('johndoe@gmail.com');
  });
  it('should not be able to create a user an existing email', async () => {});
  it('should hash the password before saving the user', async () => {});
});
