import { isNullOrUndefined } from "util";
import { ForbiddenProblem, Problem } from "../../../domain/entities/Problem";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IJwtProvider } from "../../security/IJwtProvider";

export default class ResolveToken {
  private readonly userRepository: IUserRepository
  private readonly jwtProvider: IJwtProvider

  constructor(
    userRepository: IUserRepository,
    jwtProvider: IJwtProvider
  ) {
    this.userRepository = userRepository
    this.jwtProvider = jwtProvider
  }

  public async execute(token: string): Promise<User | Problem> {
    const payload = this.jwtProvider.parse(token)
    if (payload instanceof ForbiddenProblem) {
      return payload
    }

    const user = await this.userRepository.loadById(payload.id)
    if (isNullOrUndefined(user)) {
      return new ForbiddenProblem({
        detail: 'Token could not be resolved to a user'
      })
    }

    return user
  }
}