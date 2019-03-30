// tslint:disable: export-name no-unsafe-any
import { Request, Response, Router } from "express";
import { AuthRequest } from "../../../application/use_cases/auth/Authenticate";
import { resolve } from "../../../domain/container/Container";
import AuthController from "../../../interfaces/controllers/AuthController";

export const router = Router()

router.post('/authenticate', async (request: Request, response: Response) => {
  const { username, password } = request.body
  const authRequest: AuthRequest = {
    email: username,
    password
  }
  const controller = resolve<AuthController>("authController")
  response.sendPromise(controller.authenticate(authRequest))
})

