import { isEmpty } from "lodash";
import { isNullOrUndefined } from "util";
import { MissingRequiredInputsProblem, Problem, UnauthorizedProblem } from "../../../domain/entities/Problem";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IJwtProvider } from "../../security/IJwtProvider";
import IAuthnConfig from "../../../interfaces/security/IAuthnConfig";
import Fido2Authenticate from "./Fido2Authenticate";

export default class Authenticate {
  private readonly userRepository: IUserRepository
  private readonly jwtProvider: IJwtProvider
  private readonly authnConfig: IAuthnConfig
  private readonly fido2Authenticate: Fido2Authenticate

  constructor(
    userRepository: IUserRepository,
    authnConfig: IAuthnConfig,
    jwtProvider: IJwtProvider,
    fido2Authenticate: Fido2Authenticate
  ) {
    this.userRepository = userRepository
    this.jwtProvider = jwtProvider,
    this.authnConfig = authnConfig,
    this.fido2Authenticate = fido2Authenticate
  }

  public async execute(email: string, password: string): Promise<object | Problem> {
    // tslint:disable-next-line: possible-timing-attack
    if (isEmpty(email) || isEmpty(password)) {
      return new MissingRequiredInputsProblem
    }

    const user = await this.userRepository.loadByEmailAndPassword(email, password)
    if (isNullOrUndefined(user)) {
      return new UnauthorizedProblem({
        detail: 'Invalid credential'
      })
    }

    if (this.authnConfig.enable2FAWithFido2 == false) {
      return {
              token: this.jwtProvider.generateToken({
                        id: user.id
              })
      }
    }


    if (isNullOrUndefined(user.key)){
      return this.fido2Authenticate.generateAttestationOptions(user.email, false);
    }

    return this.fido2Authenticate.generateAssertionOptions(user.email);
  }
}