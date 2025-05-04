import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepositories';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { IOrder } from '../domain/models/IOrder';

interface IProduct {
  id: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}
@injectable()
export class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('CustomerRepository')
    private customersRepository: ICustomersRepository,
    @inject('ProductsRepository')
    private productRepository: IProductsRepository,
  ) {}
  public async execute({ customer_id, products }: IRequest): Promise<IOrder> {
    const customerExists = await this.customersRepository.findById(
      Number(customer_id),
    );

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.', 404);
    }

    const existsProducts = await this.productRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError(
        'Could not find any products with the given ids.',
        404,
      );
    }

    const existsProductsIds = products.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}.`,
        404,
      );
    }

    const quantityAvailable = products.filter(product => {
      return (
        existsProducts.filter(
          productExisten => productExisten.id === product.id,
        )[0].quantity < product.quantity
      );
    });

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity}
        is not available for ${quantityAvailable[0].id}.`,
        409,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updateProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await this.productRepository.updateStock(updateProductQuantity);

    return order;
  }
}
