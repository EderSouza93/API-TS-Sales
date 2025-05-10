import { v4 as uuiv4 } from 'uuid';
import UserToken from '@modules/users/infra/database/entities/UserToken';
import { IUserToken } from '../../models/IUserToken';
import { IUserTokensRepository } from '../IUserTokensRepository';

export default class FakeUserTokenRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: number): Promise<IUserToken> {
    const userToken = {
      id: Math.random(),
      token: uuiv4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.userTokens.push(userToken);

    return userToken as unknown as IUserToken;
  }

  public async findByToken(token: string): Promise<IUserToken | null> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );

    return userToken || null;
  }
}
