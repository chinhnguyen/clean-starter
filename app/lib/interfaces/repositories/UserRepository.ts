import { IUserRepository } from "../../application/repositories/IUserRepository";
import { Key } from "../../domain/entities/Key";
import { User } from "../../domain/entities/User";

const upnUser = new User({
  id: "chinh@willbe.vn",
  email: "chinh@willbe.vn",
  password: "iloveyouman",
  challenge: "123456"
})

const tfaDemoUser = new User({
  id: "2fa-tester-id",
  email: "2fa-tester@mel.ubc",
  password: "123456",
  challenge: ""
})

var users:User[] = [upnUser, tfaDemoUser]; 

export default class UserRepository implements IUserRepository {
  public async updateUserChallenge(user: User, challenge: string): Promise<void> {
    user.challenge = challenge
  }

  public async loadByEmail(email: string): Promise<User> {
    let foundUser = undefined;
    users.forEach(user => {
      if (user.email == email){
        foundUser = user;
      }
    });
    return foundUser;
  }

  public async addKeyToUser(user: User, key: Key): Promise<void> {
    user.key = key;
    user.challenge = "";
  }

  public async loadByChallenge(challenge: string): Promise<User> {
    let foundUser = undefined;
    users.forEach(user => {
      if (user.challenge == challenge){
        foundUser = user;
      }
    });
    return foundUser;
  }

  public async create(email: string, challenge: string): Promise<User> {
    let existed = false;
    users.forEach(user => {
      if (user.email == email){
        existed = true;
      }
    });
    
    if (existed){
      return undefined
    }
    
    let user = new User({ "email": email, "challenge": challenge })
    users.push(user);

    return user
  }

  public async loadByEmailAndPassword(email: string, password: string): Promise<User> {
    // tslint:disable-next-line: possible-timing-attack
    let foundUser = undefined;
    users.forEach(user => {
      if (email === user.email && password === user.password){
        foundUser = user;
      }
    });
    return foundUser;
  }

  public async loadById(id: string): Promise<User> {
    let foundUser = undefined;
    users.forEach(user => {
      if (user.id === id){
        foundUser = user;
      }
    });
    return foundUser;
  }
}