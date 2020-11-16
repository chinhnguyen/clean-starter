// tslint:disable: no-implicit-dependencies no-object-literal-type-assertion
import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';
import { Mock } from 'moq.ts';
import { IUserRepository } from '../../../../lib/application/repositories/IUserRepository';
import Authenticate from '../../../../lib/application/use_cases/auth/Authenticate';
import { Problem } from '../../../../lib/domain/entities/Problem';
import { User } from '../../../../lib/domain/entities/User';
import JwtProvider from '../../../../lib/interfaces/security/JwtProvider';
import { setProblem } from '../../../shared/Problem.steps';

let mockedLoadByEmailAndPasswordResult: User
let authResponse: string | Problem

Given('invalid credential', () => {
    mockedLoadByEmailAndPasswordResult = undefined
})

Given('User JSON {string}', (json: string) => {
    mockedLoadByEmailAndPasswordResult = new User(JSON.parse(json))
})

When('authenticate with email {string} and password {string}', async (email: string, password: string) => {
    const mockedUserRepository = new Mock<IUserRepository>()
    mockedUserRepository
        .setup(i => i.loadByEmailAndPassword)
        .returns(() => mockedLoadByEmailAndPasswordResult)
    const jwtProvider = new JwtProvider({
        key: '123',
        expiresIn: '2d'
    })
    const authenticate = new Authenticate(
        mockedUserRepository.object(),
        jwtProvider
    )
    authResponse = await authenticate.execute(email, password)
    if (authResponse instanceof Problem) {
        setProblem(authResponse)
    }
})

Then('return token having id of {string}', (expectedId: string) => {
    const token = <string>authResponse
    const encodedToken = token.split('.')[1]
    const buff = new Buffer(encodedToken, 'base64')
    const payload = buff.toString('ascii')
    const obj = <{ id: string }>JSON.parse(payload)
    expect(obj.id).to.equal(expectedId)
})