import { User } from "../../domain/entities/User";

export interface IUserRepository {
  loadByEmailAndPassword(email: string, password: string): Promise<User>
  loadById(id: string): Promise<User>
}