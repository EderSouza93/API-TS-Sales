/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppDataSource } from '@shared/infra/typeorm/data-source';
import { App } from 'supertest/types';
import appPromise from '@shared/infra/http/server';

describe('Create Customer', () => {
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
});
