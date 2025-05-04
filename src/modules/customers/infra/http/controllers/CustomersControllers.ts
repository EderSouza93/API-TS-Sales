import { Request, Response } from 'express';
import ListCustomerSevice from '@modules/customers/services/ListCustomerService';
import ShowCustomerService from '@modules/customers/services/ShowCustomerService';
import CreateCustomerService from '@modules/customers/services/CreateCustomersService';
import UpdateCustomerService from '@modules/customers/services/UpdateCustomerService';
import DeleteCustomerService from '@modules/customers/services/DeleteCustomerService';
import { container } from 'tsyringe';

export default class CustomersControllers {
  public async index(request: Request, response: Response): Promise<void> {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const listCustomers = container.resolve(ListCustomerSevice);
    const customers = await listCustomers.execute(page, limit);
    response.json(customers);
  }

  public async show(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);

    const showCustomer = container.resolve(ShowCustomerService);

    const customer = await showCustomer.execute({ id });

    response.json(customer);
  }

  public async create(request: Request, response: Response): Promise<void> {
    const { name, email } = request.body;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      name,
      email,
    });

    response.json(customer);
  }

  public async update(request: Request, response: Response): Promise<void> {
    const { name, email } = request.body;
    const id = Number(request.params.id);

    const updateCustomer = container.resolve(UpdateCustomerService);

    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });

    response.json(customer);
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);

    const deleteCustomer = container.resolve(DeleteCustomerService);

    await deleteCustomer.execute({ id });

    response.status(204).json([]);
  }
}
