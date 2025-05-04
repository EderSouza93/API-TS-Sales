import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { injectable, inject } from 'tsyringe';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

interface IRequest {
  id: number;
}
@injectable()
export default class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  async execute({ id }: IRequest): Promise<void> {
    const product = await this.productsRepository.findById(id);
    const redisCache = new RedisCache();

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    await redisCache.invalidate('api-mysales-PRODUCT_LIST');

    await this.productsRepository.remove(product);
  }
}
