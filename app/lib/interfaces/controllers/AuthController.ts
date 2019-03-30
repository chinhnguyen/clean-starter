import Authenticate from "../../application/use_cases/auth/Authenticate";
import ResolveToken from "../../application/use_cases/auth/ResolveToken";
import { Problem } from "../../domain/entities/Problem";
import { User } from "../../domain/entities/User";
import TokenSerializer, { SerializedToken } from "../serializers/TokenSerializer";

export default class AuthController {
  private readonly authenticateUC: Authenticate
  private readonly resolveTokenUC: ResolveToken
  private readonly tokenSerializer: TokenSerializer

  constructor(
    authenticate: Authenticate,
    resolveToken: ResolveToken,
    tokenSerializer: TokenSerializer
  ) {
    this.authenticateUC = authenticate
    this.resolveTokenUC = resolveToken
    this.tokenSerializer = tokenSerializer
  }

  public async authenticate(email: string, password: string): Promise<SerializedToken | Problem> {
    const token = await this.authenticateUC.execute(email, password)
    if (token instanceof Problem) {
      return token
    }
    return this.tokenSerializer.serialize(token)
  }

  public async resolveToken(token: string): Promise<User | Problem> {
    return this.resolveTokenUC.execute(token)
  }
}