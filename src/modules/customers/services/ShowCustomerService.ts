import AppError from '@shared/errors/AppError';
import { Customer } from '../infra/database/entities/Custumer';
import { ICustomersRepositories } from '../domain/repositories/ICustomersRepositories';

interface IShowCustomer {
  id: number;
}

export default class ShowCustomerService {
  constructor(private readonly customerRepository: ICustomersRepositories) {}
  public async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    return customer;
  }
}
