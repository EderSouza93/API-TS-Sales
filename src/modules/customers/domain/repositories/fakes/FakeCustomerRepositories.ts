/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICreateCustomer } from '../../models/ICreateCustomer';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import Customer from '@modules/customers/infra/database/entities/Custumer';
import { ICustomersRepository, Pagination } from '../ICustomersRepositories';

export default class FakeCustomerRepositories implements ICustomersRepository {
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer = new Customer();

    customer.id = this.customers.length + 1;
    customer.name = name;
    customer.email = email;
    customer.created_at = new Date();
    customer.updated_at = new Date();

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: ICustomer): Promise<ICustomer> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers[findIndex] = customer;

    return customer;
  }

  public async remove(customer: ICustomer): Promise<void> {
    const index = this.customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
  }

  public async findAll(): Promise<Customer[] | undefined> {
    return this.customers;
  }

  public async findByName(name: string): Promise<ICustomer | null> {
    const customer = this.customers.find(customer => customer.name === name);
    return customer as Customer | null;
  }

  public async findById(id: number): Promise<ICustomer | null> {
    const customer = this.customers.find(customer => customer.id === id);
    return customer as Customer | null;
  }

  public async findByEmail(email: string): Promise<ICustomer | null> {
    const customer = this.customers.find(customer => customer.email === email);
    return customer as Customer | null;
  }

  public async findAndCount(
    pagination: Pagination,
  ): Promise<[ICustomer[], number]> {
    const { take, skip } = pagination;

    const paginatedCustomers = this.customers.slice(skip, skip + take);
    const total = this.customers.length;

    return [paginatedCustomers, total];
  }
}
