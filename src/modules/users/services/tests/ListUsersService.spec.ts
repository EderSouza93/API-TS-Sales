import { IPaginateUser } from '@modules/users/domain/models/IPaginateUser';
import FakeUserRepository from '@modules/users/domain/repositories/fakes/FakeUserRepositories';
import ListUserService from '../ListUsersService';

let fakeUserRepository: FakeUserRepository;
let listUser: ListUserService;

describe('ListUserService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();

    fakeUserRepository.findAll = jest
      .fn()
      .mockImplementation(({ page, skip, take }) => {
        const users = [
          {
            id: 1,
            name: 'User 1',
            email: 'user1@example.com',
            password: 'password1',
            avatar: '',
            created_at: new Date(),
            updated_at: new Date(),
            getAvatarUrl: () => null,
          },
          {
            id: 2,
            name: 'User 2',
            email: 'user2@example.com',
            password: 'password2',
            avatar: '',
            created_at: new Date(),
            updated_at: new Date(),
            getAvatarUrl: () => null,
          },
          {
            id: 3,
            name: 'User 3',
            email: 'user3@example.com',
            password: 'password3',
            avatar: '',
            created_at: new Date(),
            updated_at: new Date(),
            getAvatarUrl: () => null,
          },
          {
            id: 4,
            name: 'User 4',
            email: 'user4@example.com',
            password: 'password4',
            avatar: '',
            created_at: new Date(),
            updated_at: new Date(),
            getAvatarUrl: () => null,
          },
          {
            id: 5,
            name: 'User 5',
            email: 'user5@example.com',
            password: 'password5',
            avatar: '',
            created_at: new Date(),
            updated_at: new Date(),
            getAvatarUrl: () => null,
          },
        ];

        const startIndex = skip;
        const endIndex = skip + take;
        const data = users.slice(startIndex, endIndex);

        const paginatedResult: IPaginateUser = {
          data,
          total: users.length,
          current_page: page,
          per_page: take,
        };

        return Promise.resolve(paginatedResult);
      });

    listUser = new ListUserService(fakeUserRepository);
  });

  it('should be able to list users with pagination', async () => {
    const paginationParams = {
      page: 1,
      skip: 0,
      take: 3,
    };

    const result = await listUser.execute(paginationParams);

    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('current_page');
    expect(result).toHaveProperty('per_page');

    expect(result.data.length).toBe(3);
    expect(result.total).toBe(5);
    expect(result.current_page).toBe(1);
    expect(result.per_page).toBe(3);

    expect(fakeUserRepository.findAll).toHaveBeenCalledWith(paginationParams);
  });
  it('should return second page of users', async () => {
    const paginationParams = {
      page: 2,
      skip: 3,
      take: 3,
    };

    const result = await listUser.execute(paginationParams);

    expect(result.data.length).toBe(2);
    expect(result.total).toBe(5);
    expect(result.current_page).toBe(2);
    expect(result.per_page).toBe(3);
  });

  it('should return an empty array when page exceeds available data', async () => {
    const paginationParams = {
      page: 3,
      skip: 6,
      take: 3,
    };

    const result = await listUser.execute(paginationParams);

    expect(result.data.length).toBe(0);
    expect(result.total).toBe(5);
    expect(result.current_page).toBe(3);
    expect(result.per_page).toBe(3);
  });
});
