import { Product } from '@modules/products/infra/database/entities/Product';
import { SearchParams } from '@modules/users/infra/database/repositories/UsersRepository';
import { ICreateProduct } from '../../models/ICreateProduct';
import { IFindProducts } from '../../models/IFindProducts';
import { IProduct } from '../../models/IProduct';
import { IProductPaginate } from '../../models/IProductPaginate';
import { IUpdateStockProduct } from '../../models/IUpdateStockProduct';
import { IProductsRepository } from '../IProductsRepository';

export default class FakeProductRepositories implements IProductsRepository {
  private products: Product[] = [];

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct> {
    const product = new Product();

    product.id = this.products.length + 1;
    product.name = name;
    product.price = price;
    product.quantity = quantity;

    this.products.push(
      Object.assign(new Product(), product, {
        order_products: product.order_products || [],
      }),
    );

    return product;
  }

  public async save(product: IProduct): Promise<IProduct> {
    const findIndex = this.products.findIndex(
      findProduct => findProduct.id === product.id,
    );
    if (findIndex >= 0) {
      this.products[findIndex] = Object.assign(new Product(), product);
    } else {
      this.products.push(
        Object.assign(new Product(), product, {
          order_products: product.order_products || [],
        }),
      );
    }
    return product;
  }

  public async remove(product: IProduct): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IProductPaginate> {
    const total = this.products.length;
    const paginated = this.products.slice(skip, skip + take);

    return {
      total,
      per_page: take,
      current_page: page,
      data: paginated,
    };
  }

  public async findByName(name: string): Promise<IProduct | null> {
    const product = this.products.find(product => product.name === name);
    return product as Product | null;
  }

  public async findById(id: number): Promise<IProduct | null> {
    const product = this.products.find(p => p.id === id);
    return product as Product | null;
  }

  public async findAllByIds(products: IFindProducts[]): Promise<IProduct[]> {
    return this.products.filter(p => products.some(req => req.id === p.id));
  }

  public async updateStock(
    productsToUpdate: IUpdateStockProduct[],
  ): Promise<void> {
    productsToUpdate.forEach(update => {
      const product = this.products.find(p => p.id === update.id);
      if (product) {
        product.quantity = update.quantity;
      }
    });
  }
}
