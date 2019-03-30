// tslint:disable: variable-name

export class User {
  public id: string
  public email: string
  public password: string
  // tslint:disable-next-line: no-any
  constructor(json: any) {
    Object.assign(this, json)
  }
}
