
export interface SerializedToken {
  token: string
}

export default class TokenSerializer {
  public serialize(token: string): SerializedToken {
    return { token }
  }
}