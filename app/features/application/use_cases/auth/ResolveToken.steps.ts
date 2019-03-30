import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';
import { Mock } from 'moq.ts';
import { IUserRepository } from '../../../../lib/application/repositories/IUserRepository';
import { IJwtProvider, TokenPayload } from '../../../../lib/application/security/IJwtProvider';
import ResolveToken from '../../../../lib/application/use_cases/auth/ResolveToken';
import { ForbiddenProblem, Problem } from '../../../../lib/domain/entities/Problem';
import { User } from '../../../../lib/domain/entities/User';
import { setProblem } from '../../../shared/Problem.steps';

let resolveTokenResult: User | Problem
let mockedParseTokenResult: TokenPayload | Problem = new ForbiddenProblem
let mockedUser: User

Given('valid token', () => {
  mockedParseTokenResult = { id: 'any' }
})

Given('token could not be resolved to a user', () => {
  mockedUser = undefined
})

Given('token resolved to an existing user', () => {
  mockedUser = new User({ id: 'anyid' })
})

When('resolve token {string}', async (token: string) => {
  const mockedUserRepository = new Mock<IUserRepository>()
  const jwtProvider = new Mock<IJwtProvider>()
  const resolveToken = new ResolveToken(
    mockedUserRepository.object(),
    jwtProvider.object()
  )
  jwtProvider
    .setup(i => i.parse)
    .returns(() => mockedParseTokenResult)
  mockedUserRepository
    .setup(i => i.loadById)
    .returns(() => mockedUser)

  resolveTokenResult = await resolveToken.execute(token)
  if (resolveTokenResult instanceof Problem) {
    setProblem(resolveTokenResult)
  }
})

Then('return the matching user', () => {
  expect((<User>resolveTokenResult).id).to.equal(mockedUser.id)
})
