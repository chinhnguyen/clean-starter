import { IUserRepository } from "../../application/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { Key } from "../../domain/entities/Key";

const user = new User({
  id: "chinh@willbe.vn",
  email: "chinh@willbe.vn",
  password: "iloveyouman",
  challenge:"123456"
})

var webAuthenUser = new User({})

export default class UserRepository implements IUserRepository {

  public async updateUserChallenge(user: User, challenge: string): Promise<void> {
    webAuthenUser.challenge = challenge
  }
  public async loadByEmail(email: string): Promise<User> {
    if (email === webAuthenUser.email) {
      return webAuthenUser
    }
    return undefined
  }
  public async addKeyToUser(user: Promise<User>, key: Key): Promise<void> {
    webAuthenUser.key = key
  }

  public async loadByChallenge(challenge: string): Promise<User> {
    if (challenge === webAuthenUser.challenge) {
      return webAuthenUser
    }
    return undefined
  }

  public async create(id: string, email: string, challenge: string): Promise<User> {
    webAuthenUser = new User({"id": id, "email": email, "challenge": challenge})
    return webAuthenUser
  }

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