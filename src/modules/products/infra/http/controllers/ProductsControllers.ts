import { Request, Response } from 'express';
import ListProductService from '@modules/products/services/ListProductService';
import ShowProductService from '@modules/products/services/ShowProductService';
import { CreateProductService } from '@modules/products/services/CreateProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import { container } from 'tsyringe';

export default class ProductsControllers {
  async index(request: Request, response: Response): Promise<void> {
    const { page, skip, take } = request.query;
    const listProductsService = container.resolve(ListProductService);
    const products = await listProductsService.execute({
      page: Number(page),
      skip: Number(skip),
      take: Number(take),
    });

    response.json(products);
  }

  async show(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    const showProductService = container.resolve(ShowProductService);

    const product = await showProductService.execute({ id });

    response.json(product);
  }

  async create(request: Request, response: Response): Promise<void> {
    const { name, price, quantity } = request.body;

    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name,
      price,
      quantity,
    });

    response.json(product);
  }

  async update(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    const { name, price, quantity } = request.body;

    const updateProductService = container.resolve(UpdateProductService);

    const product = await updateProductService.execute({
      id,
      name,
      price,
      quantity,
    });

    response.json(product);
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);

    const deleteProductService = container.resolve(DeleteProductService);

    await deleteProductService.execute({ id });

    response.status(204).send([]);
  }
}
// It does not have the try catch because the express-async-errors lib handles the request through the ErrorHandleMiddleware Middleware
