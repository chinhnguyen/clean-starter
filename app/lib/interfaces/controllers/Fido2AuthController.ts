import Fido2Authenticate from "../../application/use_cases/auth/Fido2Authenticate";
import { Problem } from "../../domain/entities/Problem";

export default class Fido2AuthnController {
  private readonly fido2AuthenticateUC: Fido2Authenticate

  constructor(
    fido2Authenticate: Fido2Authenticate,
  ) {
    this.fido2AuthenticateUC = fido2Authenticate
  }

  public async generateRegisterChallenge(email: string): Promise<object | Problem> {

    const challengeResponse = await this.fido2AuthenticateUC.generateAttestationOptions(email)

    if (challengeResponse instanceof Problem) {
      return { "error": "cannot generate challenge request" }
    }

    return challengeResponse
  }

  public async validateRegisterAttestation(attestation: any): Promise<object | Problem> {

    const status = await this.fido2AuthenticateUC.validateAttestation(attestation)

    if (status instanceof Problem) {
      return { "error": "cannot register" }
    }

    return status
  }

  public async generateLoginChallenge(email: string): Promise<object | Problem> {

    const challengeResponse = await this.fido2AuthenticateUC.generateAssertionOptions(email)

    if (challengeResponse instanceof Problem) {
      return { "error": "cannot login" }
    }

    return challengeResponse
  }

  public async validateLoginAssertion(assertion: any): Promise<object | Problem> {

    const status = await this.fido2AuthenticateUC.validateAssertion(assertion)

    if (status instanceof Problem) {
      return { "error": "cannot execute login challenge" }
    }

    return status
  }
}