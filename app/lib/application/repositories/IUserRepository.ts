import { User } from "../../domain/entities/User";
import { Key } from "../../domain/entities/Key";

export interface IUserRepository {
  updateUserChallenge(user: User, challenge: string): Promise<void>;
  loadByEmail(email: string): Promise<User>;
  addKeyToUser(user: Promise<User>, key: Key): Promise<void>;
  loadByChallenge(challenge: string): Promise<User>;
  loadByEmailAndPassword(email: string, password: string): Promise<User>
  loadById(id: string): Promise<User>
  create(id: string, email: string, challenge: string): Promise<User>
}