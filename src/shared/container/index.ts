import { ICustomersRepositories } from '@modules/customers/domain/repositories/ICustomersRepositories';
import customerRepository from '@modules/customers/infra/database/repositories/CustomerRepositories';
import { container } from 'tsyringe';

container.registerSingleton<ICustomersRepositories>(
  'CustomersRepositories',
  customerRepository,
);
