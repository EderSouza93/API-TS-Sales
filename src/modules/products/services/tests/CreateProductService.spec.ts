import { productMock } from '@modules/products/domain/factories/productFactory';
import FakeProductRepositories from '@modules/products/domain/repositories/fakes/FakeProductRepositories';
import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { CreateProductService } from '../CreateProductService';

jest.mock('@shared/cache/RedisCache');

let fakeProductRepository: FakeProductRepositories;
let createProduct: CreateProductService;

describe('CreateProductService', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepositories();
    createProduct = new CreateProductService(fakeProductRepository);
  });

  it('should be able to create a new product', async () => {
    const product = await createProduct.execute({ ...productMock });

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('PlayStation 5');
    expect(product.price).toBe(5000.99);
    expect(product.quantity).toBe(500);
  });

  it('should not be able to create a new product with name is already in use', async () => {
    await createProduct.execute({ ...productMock });
    await expect(
      createProduct.execute({ ...productMock }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('sould be to invalidate the cache when a new product is created', async () => {
    const invalidateSpy = jest.spyOn(RedisCache.prototype, 'invalidate');

    await createProduct.execute({ ...productMock });

    expect(invalidateSpy).toHaveBeenLastCalledWith('api-mysales-PRODUCT_LIST');
  });
});
