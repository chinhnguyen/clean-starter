import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { IJwtProvider, TokenPayload } from "../../application/security/IJwtProvider";
import { ForbiddenProblem } from "../../domain/entities/Problem";
import IJwtConfig from "./IJwtConfig";

export default class JwtProvider implements IJwtProvider {
  private readonly config: IJwtConfig
  constructor(jwtConfig: IJwtConfig) {
    this.config = jwtConfig
  }

  public generateToken(payload: TokenPayload): string {
    return sign(payload, this.config.key, {
      expiresIn: this.config.expiresIn
    })
  }

  public parse(token: string): TokenPayload | ForbiddenProblem {
    try {
      return <TokenPayload>verify(token, this.config.key)
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        return new ForbiddenProblem({
          detail: 'Invalid access token'
        })
      }
    }
  }
}