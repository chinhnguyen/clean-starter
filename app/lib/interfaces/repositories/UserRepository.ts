import { IUserRepository } from "../../application/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export default class UserRepository implements IUserRepository {
  public async loadByEmailAndPassword(email: string, password: string): Promise<User> {
    throw new Error('not implemented')
  }

  public async loadById(id: string): Promise<User> {
    throw new Error('not implemented')
  }
}