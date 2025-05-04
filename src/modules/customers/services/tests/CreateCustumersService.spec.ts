import AppError from '@shared/errors/AppError';
import { customerMock } from '../../domain/factories/customerFactory';
import FakeCustomerRepositories from '../../domain/repositories/fakes/FakeCustomerRepositories';
import CreateCustomerService from '../CreateCustomersService';

let fakeCustomerRepository: FakeCustomerRepositories;
let createCustomerService: CreateCustomerService;

describe('CreateCustomerService', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    createCustomerService = new CreateCustomerService(fakeCustomerRepository);
  });
  it('should be able to create a new customer', async () => {
    const customer = await createCustomerService.execute({ ...customerMock });

    expect(customer).toHaveProperty('id');
    expect(customer.name).toBe('John Doe');
    expect(customer.email).toBe('john@example.com');
  });
  it('should not be able to create a new customer with email that is already in use', async () => {
    await createCustomerService.execute({ ...customerMock });
    await expect(
      createCustomerService.execute({ ...customerMock }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
