import { isEmpty } from "lodash";

export default class NoSensitiveDataFilter {
  public filter<T>(obj: T): T {
    const passwordContainer = <{ password: string }><unknown>obj
    if (!isEmpty(passwordContainer.password)) {
      passwordContainer.password = ' '
    }
    return obj
  }
}