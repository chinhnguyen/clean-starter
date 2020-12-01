// tslint:disable: no-implicit-dependencies no-object-literal-type-assertion
import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';
import { Mock } from 'moq.ts';
import { IUserRepository } from '../../../../lib/application/repositories/IUserRepository';
import Fido2Authenticate from '../../../../lib/application/use_cases/auth/Fido2Authenticate';
import { Problem } from '../../../../lib/domain/entities/Problem';
import { User } from '../../../../lib/domain/entities/User';
import AuthnConfig from '../../../../lib/interfaces/config/AuthnConfig';
import { setProblem } from '../../../shared/Problem.steps';
import JwtProvider from '../../../../lib/interfaces/security/JwtProvider';

let mockedWebAuthnUser: User
let rpResponse: object | Problem

Given('WebAuthNUser JSON {string}', (json: string) => {
    mockedWebAuthnUser = new User(JSON.parse(json))
})

When('requestRegister with email {string}', async (email: string) => {
    mockedWebAuthnUser = new User({})
    const mockedUserRepository = new Mock<IUserRepository>()
    mockedUserRepository
        .setup(i => i.create)
        .returns(() => mockedWebAuthnUser)
    mockedUserRepository
        .setup(i => i.loadByEmail)
        .returns(() => mockedWebAuthnUser)
    mockedUserRepository
        .setup(i => i.updateUserChallenge)
        .returns(() => { })

    const authnConfig = new AuthnConfig()
    authnConfig.enable2FAWithFido2 = false;
    authnConfig.enablePasswordless = true;

    const jwtProvider = new JwtProvider({
        key: '123',
        expiresIn: '2d'
    })

    const fido2Authenticate = new Fido2Authenticate(
        mockedUserRepository.object(),
        authnConfig,
        jwtProvider
    )

    rpResponse = await fido2Authenticate.generateAttestationOptions(email, true)
    if (rpResponse instanceof Problem) {
        setProblem(rpResponse)
    }
})

Then('return attestationoption having challenge not null and attestation is direct', () => {
    const attestationOptions = <{ challenge: string, attestation: string }>JSON.parse(JSON.stringify(rpResponse))
    expect(attestationOptions.challenge).to.not.be.null
    expect(attestationOptions.attestation).to.equal("direct")
})

When('register with attestation {string}', async (attestation: string) => {
    const mockedUserRepository = new Mock<IUserRepository>()
    mockedUserRepository
        .setup(i => i.loadByChallenge)
        .returns(() => mockedWebAuthnUser)
    mockedUserRepository
        .setup(i => i.addKeyToUser)
        .returns(() => { })

    const authnConfig = new AuthnConfig()
    authnConfig.enable2FAWithFido2 = false;
    authnConfig.enablePasswordless = true;
    const jwtProvider = new JwtProvider({
        key: '123',
        expiresIn: '2d'
    })

    const fido2Authenticate = new Fido2Authenticate(
        mockedUserRepository.object(),
        authnConfig,
        jwtProvider
    )

    rpResponse = await fido2Authenticate.validateAttestation(JSON.parse(attestation))
    if (rpResponse instanceof Problem) {
        setProblem(rpResponse)
    }
})

Then('return true', () => {
    const authenticationResult = <{ registerStatus: boolean }>JSON.parse(JSON.stringify(rpResponse))
    expect(authenticationResult.registerStatus).to.not.be.null
    expect(authenticationResult.registerStatus).to.equal(true)
})

When('login with email {string}', async (email: string) => {
    const mockedUserRepository = new Mock<IUserRepository>()
    mockedUserRepository
        .setup(i => i.loadByEmail)
        .returns(() => mockedWebAuthnUser)
    mockedUserRepository
        .setup(i => i.updateUserChallenge)
        .returns(() => { })

    const authnConfig = new AuthnConfig()
    authnConfig.enable2FAWithFido2 = false;
    authnConfig.enablePasswordless = true;
    const jwtProvider = new JwtProvider({
        key: '123',
        expiresIn: '2d'
    })

    const fido2Authenticate = new Fido2Authenticate(
        mockedUserRepository.object(),
        authnConfig,
        jwtProvider
    )

    rpResponse = await fido2Authenticate.generateAssertionOptions(email)
    if (rpResponse instanceof Problem) {
        setProblem(rpResponse)
    }
})

Then('return assertionOptions having different challenge than {string}', (priorChallenge: string) => {
    const assertionOptions = <{ challenge: string, allowCredentials: any }>JSON.parse(JSON.stringify(rpResponse))
    expect(assertionOptions.allowCredentials).to.not.be.null
    expect(assertionOptions.challenge).to.not.equals(priorChallenge)
})

Then('return valid token', () => {
    const issuedToken = (<{token: string, status: Boolean} >JSON.parse(JSON.stringify(rpResponse)))
    expect(issuedToken.status).to.not.be.null
    expect(issuedToken.status).to.equals(true)
})

When('loginChallenge with assertion {string}', async (assertion: string) => {
    const mockedUserRepository = new Mock<IUserRepository>()
    mockedUserRepository
        .setup(i => i.loadByChallenge)
        .returns(() => mockedWebAuthnUser)
    mockedUserRepository
        .setup(i => i.updateUserChallenge)
        .returns(() => { })

    const authnConfig = new AuthnConfig()
    authnConfig.enable2FAWithFido2 = false;
    authnConfig.enablePasswordless = true;
    const jwtProvider = new JwtProvider({
        key: '123',
        expiresIn: '2d'
    })

    const fido2Authenticate = new Fido2Authenticate(
        mockedUserRepository.object(),
        authnConfig,
        jwtProvider
    )

    rpResponse = await fido2Authenticate.validateAssertion(JSON.parse(assertion))

    if (rpResponse instanceof Problem) {
        setProblem(rpResponse)
    }
})
