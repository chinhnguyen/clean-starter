// tslint:disable: export-name

import { NextFunction, Request, RequestHandler, Response } from "express";
import { isEmpty } from 'lodash';
import { resolve } from "../../../domain/container/Container";
import { ForbiddenProblem, Problem } from "../../../domain/entities/Problem";
import AuthController from "../../../interfaces/controllers/AuthController";
// import { resolveToken, ResolveTokenResult } from '../../../../services/AuthService';

/**
 * Role based authentication, user is taken from request token.
 * @param roles list of roles to accept
 */
export function authorizeUser(roles: string[]): RequestHandler {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    // let token = request.param("token")
    // console.log('token-param', token)
    // if (isEmpty(token)) {    
    const bearerHeader = request.header('authorization')
    if (isEmpty(bearerHeader)) {
      response.sendProblem(new ForbiddenProblem({
        detail: 'Missing authorization token'
      }))
      return
    }
    const bearer = bearerHeader.split(' ')
    const token = bearer[1]
    // console.log('token-header', token)
    // }
    const authController = resolve<AuthController>('authController')
    const resolvedToken = await authController.resolveToken(token, roles)
    if (resolvedToken instanceof Problem) {
      response.sendProblem(resolvedToken)
      return
    }

    Object.assign(request, resolvedToken)
    next()
  }
}