import FakeProductRepositories from '@modules/products/domain/repositories/fakes/FakeProductRepositories';
import ListProductService from '../ListProductService';
import { IProductPaginate } from '@modules/products/domain/models/IProductPaginate';

const mockRecover = jest.fn();
const mockSave = jest.fn();

jest.mock('@shared/cache/RedisCache', () => {
  return jest.fn().mockImplementation(() => ({
    recover: mockRecover,
    save: mockSave,
  }));
});

let fakeProductRepository: FakeProductRepositories;
let listProducts: ListProductService;

describe('ListProductService', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepositories();
    listProducts = new ListProductService(fakeProductRepository);
    mockRecover.mockReset();
    mockSave.mockReset();
  });

  it('should return products from cache if available', async () => {
    const cachedData: IProductPaginate = {
      data: [
        {
          id: 1,
          name: 'Xbox Series X',
          price: 4999,
          quantity: 10,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      total: 1,
      current_page: 1,
      per_page: 10,
    };

    mockRecover.mockResolvedValueOnce(cachedData);

    const result = await listProducts.execute({ page: 1, skip: 0, take: 10 });

    expect(mockRecover).toHaveBeenCalledWith('api-mysales-PRODUCT_LIST');
    expect(result).toEqual(cachedData);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('should fetch from repository and cache it if not in Redis', async () => {
    mockRecover.mockResolvedValueOnce(null);

    await fakeProductRepository.create({
      name: 'PS5',
      price: 4999,
      quantity: 100,
    });

    const result = await listProducts.execute({ page: 1, skip: 0, take: 10 });

    expect(result.data.length).toBeGreaterThan(0);
    expect(mockRecover).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledWith(
      'api-mysales-PRODUCT_LIST',
      JSON.stringify(result),
    );
  });

  it('should return object with IProductPaginate structure', async () => {
    mockRecover.mockResolvedValueOnce(null);

    await fakeProductRepository.create({
      name: 'Steam Deck',
      price: 2999,
      quantity: 50,
    });

    const result = await listProducts.execute({ page: 1, skip: 0, take: 10 });

    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('per_page');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('current_page');
    expect(Array.isArray(result.data)).toBe(true);
  });
});
