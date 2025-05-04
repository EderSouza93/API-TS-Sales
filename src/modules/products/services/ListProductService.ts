import RedisCache from '@shared/cache/RedisCache';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { inject, injectable } from 'tsyringe';
import { SearchParams } from '@modules/users/infra/database/repositories/UsersRepository';
import { IProductPaginate } from '../domain/models/IProductPaginate';
@injectable()
export default class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  async execute({ page, skip, take }: SearchParams): Promise<IProductPaginate> {
    const redisCache = new RedisCache();

    let products = await redisCache.recover<IProductPaginate>(
      'api-mysales-PRODUCT_LIST',
    );

    if (!products) {
      products = await this.productsRepository.findAll({ page, skip, take });

      await redisCache.save(
        'api-mysales-PRODUCT_LIST',
        JSON.stringify(products),
      );
    }

    return products as IProductPaginate;
  }
}
