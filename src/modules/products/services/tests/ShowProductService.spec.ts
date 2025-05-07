import { productMock } from '@modules/products/domain/factories/productFactory';
import FakeProductRepositories from '@modules/products/domain/repositories/fakes/FakeProductRepositories';
import AppError from '@shared/errors/AppError';
import ShowProductService from '../ShowProductService';

let fakeProductService: FakeProductRepositories;
let showProduct: ShowProductService;

describe('ShowProductService', () => {
  beforeEach(() => {
    fakeProductService = new FakeProductRepositories();
    showProduct = new ShowProductService(fakeProductService);
  });

  it('should be able to return a product by id', async () => {
    const createdProduct = await fakeProductService.create({
      ...productMock,
    });

    const product = await showProduct.execute({ id: createdProduct.id });

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('PlayStation 5');
    expect(product.price).toBe(5000.99);
    expect(product.quantity).toBe(500);
  });

  it('should be able to return an error if product is not found', async () => {
    await expect(showProduct.execute({ id: 999 })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
