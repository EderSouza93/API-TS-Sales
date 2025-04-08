import AppError from '@shared/errors/AppError';
import { ICustomersRepositories } from '../domain/repositories/ICustomersRepositories';

interface IDeleteCustomer {
  id: number;
}

export default class DeleteCustomerService {
  constructor(private readonly customerRepository: ICustomersRepositories) {}
  public async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    await this.customerRepository.remove(customer);
  }
}
