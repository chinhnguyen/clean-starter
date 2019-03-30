import Authenticate from "../../application/use_cases/auth/Authenticate";
import ResolveToken from "../../application/use_cases/auth/ResolveToken";
import { Problem } from "../../domain/entities/Problem";
import { User } from "../../domain/entities/User";
import NoSensitiveDataFilter from "../serializers/NoSensitiveDataFilter";

export default class AuthController {
  private readonly authenticateUC: Authenticate
  private readonly resolveTokenUC: ResolveToken
  private readonly noSensitiveDataFilter: NoSensitiveDataFilter

  constructor(
    authenticate: Authenticate,
    resolveToken: ResolveToken,
    noSensitiveDataFilter: NoSensitiveDataFilter
  ) {
    this.authenticateUC = authenticate
    this.resolveTokenUC = resolveToken
    this.noSensitiveDataFilter = noSensitiveDataFilter
  }

  public async authenticate(email: string, password: string): Promise<string | Problem> {
    return this.authenticateUC.execute(email, password)
  }

  public async resolveToken(token: string): Promise<User | Problem> {
    return this.resolveTokenUC.execute(token)
  }
}