/* eslint-disable @typescript-eslint/no-unused-vars */
import { customerMock } from '@modules/customers/domain/factories/customerFactory';
import FakeCustomerRepositories from '@modules/customers/domain/repositories/fakes/FakeCustomerRepositories';
import AppError from '@shared/errors/AppError';
import UpdateCustomerService from '../UpdateCustomerService';

let fakeCustomerRepository: FakeCustomerRepositories;
let updateCustomer: UpdateCustomerService;

describe('UpdateCustomerService', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    updateCustomer = new UpdateCustomerService(fakeCustomerRepository);
  });

  it('should be able to update an existing customer', async () => {
    const createdCustomer = await fakeCustomerRepository.create({
      ...customerMock,
    });

    const updated = await updateCustomer.execute({
      id: createdCustomer.id,
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    expect(updated.name).toBe('Jane Doe');
    expect(updated.email).toBe('jane@example.com');
  });

  it('should throw error if customer does not exist', async () => {
    await expect(
      updateCustomer.execute({
        id: 999,
        name: 'Test',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow updating email to one already in use by another customer', async () => {
    const customer1 = await fakeCustomerRepository.create({
      name: 'User One',
      email: 'one@example.com',
    });

    const customer2 = await fakeCustomerRepository.create({
      name: 'User Two',
      email: 'two@example.com',
    });

    await expect(
      updateCustomer.execute({
        id: customer2.id,
        name: 'User Two Updated',
        email: 'one@example.com', //email used by user one
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
