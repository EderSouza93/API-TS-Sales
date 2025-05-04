import { ShowOrderService } from '@modules/orders/services/ShowOrderService';
import { CreateOrderService } from '@modules/orders/services/CreateOrderService';
import { ListOrderService } from '@modules/orders/services/ListOrderService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class OrderController {
  public async index(request: Request, response: Response): Promise<void> {
    const page = request.query.page ? Number(request.query.page) : 1;
    const limit = request.query.limit ? Number(request.query.limit) : 15;
    const listOrders = container.resolve(ListOrderService);

    const orders = await listOrders.execute({ page, limit });

    response.json(orders);
  }
  public async show(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);

    const showOrder = container.resolve(ShowOrderService);

    const order = await showOrder.execute({ id });

    response.json(order);
  }

  async create(request: Request, response: Response): Promise<void> {
    const { customer_id, products } = request.body;

    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      customer_id,
      products,
    });

    response.json(order);
  }
}
