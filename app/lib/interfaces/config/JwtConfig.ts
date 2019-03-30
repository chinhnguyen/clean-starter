import * as cfg from "../../infrastructure/config/jwt.json";
import IJwtConfig from "../security/IJwtConfig";

export default class JwtConfig implements IJwtConfig {
  public readonly key: string;
  public readonly expiresIn: string

  constructor() {
    Object.assign(this, process.env.STAGE === 'production' ? cfg.production : cfg.staging)
  }
}