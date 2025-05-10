import FakeCustomerRepositories from '../../domain/repositories/fakes/FakeCustomerRepositories';
import CreateCustomerService from '../CreateCustomersService';
import ListCustomerSevice from '../ListCustomerService';

let fakeCustomerRepository: FakeCustomerRepositories;
let listCustomerService: ListCustomerSevice;
let createCustomerService: CreateCustomerService;

describe('ListCustomerService', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    listCustomerService = new ListCustomerSevice(fakeCustomerRepository);
    createCustomerService = new CreateCustomerService(fakeCustomerRepository);
  });

  it('should be able to return paginated list of customers', async () => {
    for (let i = 0; i < 15; i++) {
      await createCustomerService.execute({
        name: `Customer ${i + 1}`,
        email: `Customer${i + 1}@example.com`,
      });
    }

    const page = 2;
    const limit = 5;

    const result = await listCustomerService.execute(page, limit);

    expect(result.data.length).toBe(5);
    expect(result.total).toBe(15);
    expect(result.per_page).toBe(5);
    expect(result.current_page).toBe(2);
    expect(result.total_pages).toBe(3);
    expect(result.next_page).toBe(3);
    expect(result.prev_page).toBe(1);
  });

  it('should be able to return empty list if no customers exists', async () => {
    const result = await listCustomerService.execute(1, 10);

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.total_pages).toBe(0);
    expect(result.next_page).toBeNull();
    expect(result.prev_page).toBeNull();
  });
});
