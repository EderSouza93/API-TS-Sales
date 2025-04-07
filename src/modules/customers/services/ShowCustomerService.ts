import AppError from '@shared/errors/AppError';
import { customerRepository } from '../infra/database/repositories/CustomerRepositories';
import { Customer } from '../infra/database/entities/Custumer';

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
