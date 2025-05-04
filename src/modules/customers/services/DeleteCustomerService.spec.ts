import AppError from '@shared/errors/AppError';
import { customerMock } from '../domain/factories/customerFactory';
import FakeCustomerRepositories from '../domain/repositories/fakes/FakeCustomerRepositories';
import CreateCustomerService from './CreateCustomersService';
import DeleteCustomerService from './DeleteCustomerService';

let fakeCustomerRepository: FakeCustomerRepositories;
let deleteCustomerService: DeleteCustomerService;
let createCustomerService: CreateCustomerService;

describe('DeleteCustomerService', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    deleteCustomerService = new DeleteCustomerService(fakeCustomerRepository);
    createCustomerService = new CreateCustomerService(fakeCustomerRepository);
  });
  it('should be able delete a customer successfully', async () => {
    const customer = await createCustomerService.execute(customerMock);

    await expect(
      deleteCustomerService.execute({ id: customer.id }),
    ).resolves.toBeUndefined();

    const foundCustumer = await fakeCustomerRepository.findById(customer.id);
    expect(foundCustumer).toBeUndefined();
  });

  it('should be able throw an error when trying to delete a non-existing customer', async () => {
    await expect(
      deleteCustomerService.execute({ id: 999 }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
