import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IShowCustomer } from '../domain/models/IShowCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepositories';

@injectable()
export default class DeleteCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomersRepository,
  ) {}

  public async execute({ id }: IShowCustomer): Promise<void> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    await this.customerRepository.remove(customer);
  }
}
