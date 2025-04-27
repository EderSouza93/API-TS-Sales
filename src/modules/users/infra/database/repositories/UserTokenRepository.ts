import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import { Repository } from 'typeorm';
import UserToken from '../entities/UserToken';
import { AppDataSource } from '@shared/infra/typeorm/data-source';
import { IUserToken } from '@modules/users/domain/models/IUserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<IUserToken | null> {
    const userToken = await this.ormRepository.findOneBy({
      token,
    });

    return userToken as unknown as IUserToken;
  }

  public async generate(user_id: number): Promise<IUserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken as unknown as IUserToken;
  }
}

export default UserTokensRepository;
