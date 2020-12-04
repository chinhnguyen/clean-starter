
export interface SerializedToken {
  issuedToken: string
}

export default class TokenSerializer {
  public serialize(token: object): SerializedToken {
    var serializedToken = JSON.stringify(token)
    return { "issuedToken": serializedToken}
  }
}