import { Request, Response } from 'express';
import ListCustomerSevice from '../services/ListCustomerService';
import ShowCustomerService from '../services/ShowCustomerService';
import CreateCustomerService from '../services/CreateCustomersService';
import UpdateCustomerService from '../services/UpdateCustomerService';
import DeleteCustomerService from '../services/DeleteCustomerService';

export default class CustomersControllers {
  async index(request: Request, response: Response): Promise<void> {
    const listCustomers = new ListCustomerSevice();
    const customers = await listCustomers.execute();
    response.json(customers);
  }

  async show(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    const showCustomer = new ShowCustomerService();
    const customer = await showCustomer.execute({ id });
    response.json(customer);
  }

  async create(request: Request, response: Response): Promise<void> {
    const { name, email } = request.body;

    const createCustomer = new CreateCustomerService();
    const customer = await createCustomer.execute({
      name,
      email,
    });

    response.json(customer);
  }

  async update(request: Request, response: Response): Promise<void> {
    const { name, email } = request.body;
    const id = Number(request.params.id);

    const updateCustomer = new UpdateCustomerService();
    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });

    response.json(customer);
  }

  async delete(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    const deleteCustomer = new DeleteCustomerService();
    await deleteCustomer.execute({ id });
    response.status(204).json([]);
  }
}
