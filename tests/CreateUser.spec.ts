import { AppDataSource } from '@shared/infra/typeorm/data-source';
import request from 'supertest';
import appPromise from '@shared/infra/http/server';
import { App } from 'supertest/types';

describe('Create User', () => {
  let app: App;
  beforeAll(async () => {
    await AppDataSource.initialize();
    app = (await appPromise) as App;
  });

  afterAll(async () => {
    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
    await AppDataSource.destroy();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('johndoe@example.com');
  });
});
