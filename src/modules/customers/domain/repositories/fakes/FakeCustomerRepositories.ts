import { Customer } from '@modules/customers/infra/database/entities/Custumer';
import { ICreateCustomer } from '../../models/ICreateUser';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { ICustomersRepositories, Pagination } from '../ICustomersRepositories';

export default class FakeCustomerRepositories
  implements ICustomersRepositories
{
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer = new Customer();

    customer.id = this.customers.length + 1;
    customer.name = name;
    customer.email = email;

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

  findAndCount(pagination: Pagination): Promise<[ICustomer[], number]> {
    throw new Error('Method not implemented.');
  }
}
