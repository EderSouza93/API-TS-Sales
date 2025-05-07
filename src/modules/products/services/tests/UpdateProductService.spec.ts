import { productMock } from '@modules/products/domain/factories/productFactory';
import FakeProductRepositories from '@modules/products/domain/repositories/fakes/FakeProductRepositories';
import AppError from '@shared/errors/AppError';
import UpdateProductService from '../UpdateProductService';

const mockInvalidate = jest.fn();

jest.mock('@shared/cache/RedisCache', () => {
  return jest.fn().mockImplementation(() => {
    return {
      invalidate: mockInvalidate,
    };
  });
});

let fakeProductRepository: FakeProductRepositories;
let updateProduct: UpdateProductService;

describe('UpdateProductService', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepositories();
    updateProduct = new UpdateProductService(fakeProductRepository);
    mockInvalidate.mockClear();
  });

  it('should be able to update an existing product', async () => {
    const createProduct = await fakeProductRepository.create({
      ...productMock,
    });

    const updated = await updateProduct.execute({
      id: createProduct.id,
      name: 'Xbox Series X',
      price: 4999.99,
      quantity: 600,
    });

    expect(updated.name).toBe('Xbox Series X');
    expect(updated.price).toBe(4999.99);
    expect(updated.quantity).toBe(600);
    expect(mockInvalidate).toHaveBeenCalledWith('api-mysales-PRODUCT_LIST');
  });

  it('should throw error if product does not exist', async () => {
    await expect(
      updateProduct.execute({
        id: 999,
        name: 'Nintendo Switch',
        price: 3499.99,
        quantity: 300,
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(mockInvalidate).not.toHaveBeenCalled();
  });

  it('should allow updating product with the same name', async () => {
    const createProduct = await fakeProductRepository.create({
      ...productMock,
    });

    const update = await updateProduct.execute({
      id: createProduct.id,
      name: productMock.name,
      price: 4000,
      quantity: 200,
    });

    expect(update.name).toBe(productMock.name);
    expect(update.price).toBe(4000);
    expect(update.quantity).toBe(200);
    expect(mockInvalidate).toHaveBeenCalled();
  });

  it('should throw error if product name is already used by another product', async () => {
    await fakeProductRepository.create({
      name: 'PlayStation 5',
      price: 5000,
      quantity: 100,
    });

    const otherProduct = await fakeProductRepository.create({
      name: 'Xbox Series S',
      price: 3000,
      quantity: 200,
    });

    await expect(
      updateProduct.execute({
        id: otherProduct.id,
        name: 'PlayStation 5',
        price: 3000,
        quantity: 200,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(mockInvalidate).not.toHaveBeenCalled();
  });

  it('should return a valid IProduct after update', async () => {
    const product = await fakeProductRepository.create({ ...productMock });

    const updated = await updateProduct.execute({
      id: product.id,
      name: 'Nitendo Switch',
      price: 2999.99,
      quantity: 100,
    });

    expect(updated).toHaveProperty('id');
    expect(updated.name).toBe('Nitendo Switch');
    expect(updated.price).toBe(2999.99);
    expect(updated.quantity).toBe(100);
    expect(mockInvalidate).toHaveBeenCalled();
  });
});
