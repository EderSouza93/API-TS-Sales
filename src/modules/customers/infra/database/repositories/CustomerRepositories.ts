import { AppDataSource } from '@shared/infra/typeorm/data-source';
import { Customer } from '../entities/Custumer';
import {
  ICustomersRepositories,
  Pagination,
} from '@modules/customers/domain/repositories/ICustomersRepositories';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateUser';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { Repository } from 'typeorm';

export default class customerRepository implements ICustomersRepositories {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Customer);
  }
  async findByName(name: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({
      name,
    });

    return customer;
  }
  async findByEmail(email: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({
      email,
    });

    return customer;
  }
  async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer = this.ormRepository.create({ name, email });

    await this.ormRepository.save(customer);

    return customer;
  }
  async save(customer: ICustomer): Promise<ICustomer> {
    await this.ormRepository.save(customer);

    return customer;
  }
  async remove(customer: ICustomer): Promise<void> {
    await this.ormRepository.remove(customer);

    return;
  }
  async findById(id: number): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({
      id,
    });

    return customer;
  }
  async findAndCount({
    take,
    skip,
  }: Pagination): Promise<[ICustomer[], number]> {
    const [customer, total] = await this.ormRepository.findAndCount({
      take,
      skip,
    });

    return [customer, total];
  }
}
