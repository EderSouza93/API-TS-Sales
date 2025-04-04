import { AppDataSource } from '@shared/typeorm/data-source';
import { Customer } from '../entities/Custumer';

export const customerRepository = AppDataSource.getRepository(Customer).extend({
  async findByName(name: string): Promise<Customer | null> {
    const customer = await this.findOneBy({
      name,
    });

    return customer;
  },

  async findByid(id: number): Promise<Customer | null> {
    const customer = await this.findOneBy({
      id,
    });

    return customer;
  },

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.findOneBy({
      email,
    });

    return customer;
  },
});
