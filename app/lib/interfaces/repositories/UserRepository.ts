import { IUserRepository } from "../../application/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

const user = new User({
  id: "chinh@willbe.vn",
  email: "chinh@willbe.vn",
  password: "iloveyouman"
})

export default class UserRepository implements IUserRepository {
  public async loadByEmailAndPassword(email: string, password: string): Promise<User> {
    // tslint:disable-next-line: possible-timing-attack
    if (email === user.email && password === user.password) {
      return user
    }
    return undefined
  }

  public async loadById(id: string): Promise<User> {
    if (id === user.id) {
      return user
    }
    return undefined
  }
}