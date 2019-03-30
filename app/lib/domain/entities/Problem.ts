// tslint:disable: completed-docs max-classes-per-file

/**
 * Generic error conforming to RFC 7807
 */
export class Problem {
  public status: number
  public type?: string
  public title?: string
  public detail?: string

  constructor(values: Object = {}) {
    Object.assign(this, values)
  }
}

export class BadRequestProblem extends Problem {
  public status: number = 400
  public title: string = 'Bad request'
}

export class MissingRequiredInputsProblem extends BadRequestProblem {
  public detail: string = 'Missing required inputs'
}

export class InvalidJSONProblem extends BadRequestProblem {
  public detail: string = 'Invalid JSON'
}

export class UnauthorizedProblem extends Problem {
  public status: number = 401
  public title: string = 'Unauthorized'
}

export class ForbiddenProblem extends Problem {
  public status: number = 403
  public title: string = 'Forbidden'
}

export class NotFoundProblem extends Problem {
  public status: number = 404
  public title: string = 'Not found'
}

export class InternalServerProblem extends Problem {
  public status: number = 500
  public title: string = 'Internal server error'
}
