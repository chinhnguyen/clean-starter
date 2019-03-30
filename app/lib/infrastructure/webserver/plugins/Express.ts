// tslint:disable: no-unsafe-any no-invalid-this no-function-expression export-name

import * as e from 'express';
import { isFunction } from 'util';
import { InternalServerProblem, Problem } from '../../../domain/entities/Problem';

e.response.sendProblem = function (problem: Problem): void {
  this.status(problem.status)
  this.json(problem)
}

e.response.sendPromise = function <T>(p: (() => Promise<T>) | Promise<T>): void {
  let promise: Promise<T>
  if (isFunction(p)) {
    promise = (<() => Promise<T>>p)()
  } else {
    promise = <Promise<T>>p
  }
  promise.then((res: T) => {
    if (res instanceof Problem) {
      this.status(res.status)
    }
    this.json(res)
  }).catch((err: Error) => {
    this.sendProblem(new InternalServerProblem({
      detail: JSON.stringify(err)
    }))
  })
}

export = e