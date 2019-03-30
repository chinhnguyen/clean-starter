import { Problem } from "../lib/domain/entities/Problem";
import { User } from "../lib/domain/entities/User";

declare module "express" {
  export interface Request {
    user?: User
  }
  export interface Response {
    sendPromise<T>(p: (() => Promise<T>) | Promise<T>): void
    sendProblem(problem: Problem): void
  }
}