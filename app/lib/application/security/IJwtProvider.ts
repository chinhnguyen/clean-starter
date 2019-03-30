import { ForbiddenProblem } from "../../domain/entities/Problem";

export interface TokenPayload {
  id: string
  username?: string
  roles?: object
}

export interface IJwtProvider {
  /**
   * Generate token for given payload
   * @param payload the payload to generate token for
   */
  generateToken(payload: TokenPayload): string

  /**
   * Parse and validate the given token and return the payload
   * @param token the token to parse from
   */
  parse(token: string): TokenPayload | ForbiddenProblem
}