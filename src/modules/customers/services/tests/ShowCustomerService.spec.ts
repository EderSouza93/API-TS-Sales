import { customerMock } from '@modules/customers/domain/factories/customerFactory';
import FakeCustomerRepositories from '@modules/customers/domain/repositories/fakes/FakeCustomerRepositories';
import AppError from '@shared/errors/AppError';
import ShowCustomerService from '../ShowCustomerService';

let fakeCustomerRepository: FakeCustomerRepositories;
let showCustomer: ShowCustomerService;

describe('ShowCustomerService', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    showCustomer = new ShowCustomerService(fakeCustomerRepository);
  });

  it('should be able to return a custumer by id', async () => {
    const createdCustomer = await fakeCustomerRepository.create({
      ...customerMock,
    });

    const customer = await showCustomer.execute({ id: createdCustomer.id });

    expect(customer).toHaveProperty('id');
    expect(customer.name).toBe('John Doe');
    expect(customer.email).toBe('john@example.com');
  });

  it('should be able to return an error if customer is not found', async () => {
    await expect(showCustomer.execute({ id: 999 })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
