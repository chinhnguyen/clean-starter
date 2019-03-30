/* tslint:disable: no-implicit-dependencies export-name */
import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';
import { RestClient } from 'typed-rest-client';

let client: RestClient
let status: number

Given('local api at {string}', (endpoint: string) => {
  client = new RestClient('api', endpoint)
})

When('post {string} with {string}', { timeout: 60 * 1000 }, async (path: string, body: string) => {
  try {
    const response = await client.create(path, JSON.parse(body))
    status = response.statusCode
  } catch (e) {
    status = (<{ statusCode: number, result: object }>e).statusCode
  }
})

Then('return status {int}', (expectedStatus: number) => {
  expect(status).to.equal(expectedStatus)
})

