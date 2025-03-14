import { Customer } from '../database/entities/Custumer';
import { customerRepository } from '../database/repositories/CustomerRepositories';

export default class ListCustomerSevice {
  async execute(): Promise<Customer[]> {
    const customers = customerRepository.find();
    return customers;
  }
}
