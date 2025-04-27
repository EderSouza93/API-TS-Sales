import AppError from '@shared/errors/AppError';
import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import CreateCustomerService from './CreateCustomersService';

describe('CreateCustomerService', () => {
  it('should be able to create a new customer', async () => {
    const fakeCustomerRepository = new FakeCustomerRepositories();
    const createCustomer = new CreateCustomerService(fakeCustomerRepository);

    const customer = await createCustomer.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
    });

    expect(customer).toHaveProperty('id');
    expect(customer.name).toBe('John Doe');
    expect(customer.email).toBe('john@gmail.com');
  });
  it('should not be able to create a new customer with email that is already in use', async () => {
    const fakeCustomerRepository = new FakeCustomerRepositories();
    const createCustomer = new CreateCustomerService(fakeCustomerRepository);

    await createCustomer.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
    });
    await expect(
      createCustomer.execute({
        name: 'John Doe',
        email: 'john@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
