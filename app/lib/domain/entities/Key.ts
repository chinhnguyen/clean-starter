// tslint:disable: variable-name

export class Key {
    public fmt: string
    public publicKey: string
    public counter: any
    public credID: string
    // tslint:disable-next-line: no-any
    constructor(json: any) {
      Object.assign(this, json)
    }
  }
  