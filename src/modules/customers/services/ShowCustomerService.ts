import AppError from '@shared/errors/AppError';
import { Customer } from '../database/entities/Custumer';
import { customerRepository } from '../database/repositories/CustomerRepositories';

interface IShowCustomer {
  id: number;
}

export default class ShowCustomerService {
  public async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await customerRepository.findByid(id);

    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    return customer;
  }
}
