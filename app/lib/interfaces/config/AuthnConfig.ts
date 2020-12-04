import * as cfg from "../../infrastructure/config/authnConfig.json";
import IAuthnConfig from "../security/IAuthnConfig";

export default class AuthnConfig implements IAuthnConfig {
    enablePasswordless: boolean;
    enable2FAWithFido2: boolean;
    constructor() {
        Object.assign(this, cfg)
    }
}