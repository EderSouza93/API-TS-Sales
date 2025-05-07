import FakeProductRepositories from '@modules/products/domain/repositories/fakes/FakeProductRepositories';
import { CreateProductService } from '../CreateProductService';
import DeleteProductService from '../DeleteProductService';
import { productMock } from '@modules/products/domain/factories/productFactory';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

jest.mock('@shared/cache/RedisCache');

let fakeProductRepository: FakeProductRepositories;
let deleteProduct: DeleteProductService;
let createProduct: CreateProductService;

describe('DeleteProductService', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepositories();
    deleteProduct = new DeleteProductService(fakeProductRepository);
    createProduct = new CreateProductService(fakeProductRepository);
  });
  it('should be able delete a product successfully', async () => {
    const product = await createProduct.execute(productMock);

    await expect(
      deleteProduct.execute({ id: product.id }),
    ).resolves.toBeUndefined();

    const foundProduct = await fakeProductRepository.findById(product.id);
    expect(foundProduct).toBeUndefined();
  });

  it('should be able to invalidate the cache when deleting a product', async () => {
    const product = await createProduct.execute(productMock);

    const invalidateSpy = jest.spyOn(RedisCache.prototype, 'invalidate');

    await deleteProduct.execute({ id: product.id });

    expect(invalidateSpy).toHaveBeenCalledWith('api-mysales-PRODUCT_LIST');
  });

  it('should be able throw an error when trying to delete a non-existing product', async () => {
    await expect(deleteProduct.execute({ id: 999 })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
