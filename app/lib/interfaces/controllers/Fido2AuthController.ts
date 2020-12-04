import Fido2Authenticate from "../../application/use_cases/auth/Fido2Authenticate";
import { Problem } from "../../domain/entities/Problem";
import TokenSerializer, { SerializedToken } from "../serializers/TokenSerializer";

export default class Fido2AuthnController {
  private readonly fido2AuthenticateUC: Fido2Authenticate
  private readonly tokenSerializer: TokenSerializer

  constructor(
    fido2Authenticate: Fido2Authenticate,
    tokenSerializer: TokenSerializer
  ) {
    this.fido2AuthenticateUC = fido2Authenticate
    this.tokenSerializer = tokenSerializer
  }

  public async generateRegisterChallenge(email: string): Promise<object | Problem> {

    const challengeResponse = await this.fido2AuthenticateUC.generateAttestationOptions(email, true)

    if (challengeResponse instanceof Problem) {
      console.log("error: " + challengeResponse.detail)
    }

    return challengeResponse
  }

  public async validateRegisterAttestation(attestation: any): Promise<object | Problem> {

    const status = await this.fido2AuthenticateUC.validateAttestation(attestation)

    if (status instanceof Problem) {
      console.log("error: " + status.detail)
    }

    return status
  }

  public async generateLoginChallenge(email: string): Promise<object | Problem> {

    const challengeResponse = await this.fido2AuthenticateUC.generateAssertionOptions(email)

    if (challengeResponse instanceof Problem) {
      console.log("error: " + challengeResponse.detail)
    }

    return challengeResponse
  }

  public async validateLoginAssertion(assertion: any): Promise<SerializedToken | Problem> {

    const token = await this.fido2AuthenticateUC.validateAssertion(assertion)

    if (token instanceof Problem) {
      console.log("error: " + token.detail)
    }

    return this.tokenSerializer.serialize(token)
  }
}