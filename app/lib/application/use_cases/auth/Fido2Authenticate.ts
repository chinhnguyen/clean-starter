import { isEmpty } from "lodash";
import { isNullOrUndefined } from "util";
import { MissingRequiredInputsProblem, Problem, UnauthorizedProblem } from "../../../domain/entities/Problem";
import { IUserRepository } from "../../repositories/IUserRepository";
import {
    parseRegisterRequest,
    generateRegistrationChallenge,
    parseLoginRequest,
    generateLoginChallenge,
    verifyAuthenticatorAssertion,
  } from "./../webauthn";

export default class Fido2Authenticate {
  private readonly userRepository: IUserRepository

  constructor(
    userRepository: IUserRepository
  ) {
    this.userRepository = userRepository
  }

  public async requestRegister(id: string, email: string): Promise<object | Problem> {
    // tslint:disable-next-line: possible-timing-attack
    if (isEmpty(email) || isEmpty(id)) {
      return new MissingRequiredInputsProblem
    }
    const challengeResponse = generateRegistrationChallenge({
        relyingParty: { name: 'ACME' },
        user: { id: id, name: email }
    });

    const user = await this.userRepository.create(id, email, challengeResponse.challenge)
    if (isNullOrUndefined(user)) {
      return new UnauthorizedProblem({
        detail: 'Invalid credential'
      })
    }
    return challengeResponse
  }

  public async register(credentials: any): Promise<object | Problem>{
    const { key, challenge } = parseRegisterRequest(credentials);

    const user = this.userRepository.loadByChallenge(challenge);

    if (isNullOrUndefined(user)) {
      return new UnauthorizedProblem({
        detail: 'Invalid register request'
      })
    }

    this.userRepository.addKeyToUser(user, key);

    return { loggedIn: true};
  }

  public async login(email: string): Promise<object | Problem> {
    // tslint:disable-next-line: possible-timing-attack
    if (isEmpty(email)) {
      return new MissingRequiredInputsProblem
    }

    const user = await this.userRepository.loadByEmail(email)
    if (isNullOrUndefined(user)) {
      return new UnauthorizedProblem({
        detail: 'Invalid credential'
      })
    }

    const assertionChallenge = generateLoginChallenge(user.key);

    this.userRepository.updateUserChallenge(user, assertionChallenge.challenge);

    return assertionChallenge;
  }

  public async loginChallenge(credentials: any): Promise<object | Problem>{
    const { challenge, keyId } = parseLoginRequest(credentials);

    if (isNullOrUndefined(challenge)) {
      return new UnauthorizedProblem({
        detail: 'Invalid challenge'
      })
    }

    const user = this.userRepository.loadByChallenge(challenge);

    if (isNullOrUndefined(user) || isNullOrUndefined((await user).key) || ((await user).key.credID !== keyId)) {
      return new UnauthorizedProblem({
        detail: 'Invalid login challenge request'
      })
    }

    const loggedIn = verifyAuthenticatorAssertion(credentials, (await user).key);

    return {loggedIn}
  }
}