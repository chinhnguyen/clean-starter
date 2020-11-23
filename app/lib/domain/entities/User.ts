// tslint:disable: variable-name

import { Key } from "./Key"

export class User {
  public id: string
  public email: string
  public password: string
  public challenge: string
  public key: Key
  // tslint:disable-next-line: no-any
  constructor(json: any) {
    Object.assign(this, json)
  }
}
