/* tslint:disable: no-implicit-dependencies */
import { assert, expect } from 'chai';
import { Then } from 'cucumber';
import { isUndefined } from 'util';
import { Problem } from '../../lib/domain/entities/Problem';

let problem: Problem

// tslint:disable-next-line: export-name
export function setProblem(p: Problem): void {
  problem = p
}

function checkProblem(): void {
  if (isUndefined(problem)) {
    assert.fail('Problem has not been set, forgot to call setProblem?')
  }
}

Then('return Bad Request Problem', () => {
  checkProblem()
  expect(problem.status).to.equal(400)
})

Then('return Unauthorized Problem', () => {
  checkProblem()
  expect(problem.status).to.equal(401)
})

Then('return Not Found Problem', () => {
  checkProblem()
  expect(problem.status).to.equal(404)
})

Then('return Forbidden Problem', () => {
  checkProblem()
  expect(problem.status).to.equal(403)
})

Then('return Internal Server Error Problem', () => {
  checkProblem()
  expect(problem.status).to.equal(500)
})

Then('Problem has detail {string}', (expectedDetail: string) => {
  checkProblem()
  expect(problem.detail).to.equal(expectedDetail)
})
