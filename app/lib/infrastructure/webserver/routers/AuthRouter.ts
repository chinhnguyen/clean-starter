// tslint:disable: export-name no-unsafe-any
import { Request, Response, Router } from "express";
import { resolve } from "../../../domain/container/Container";
import AuthController from "../../../interfaces/controllers/AuthController";

export const router = Router()

router.post('/authenticate', async (request: Request, response: Response) => {
  const { email, password } = request.body
  const controller = resolve<AuthController>("authController")
  response.sendPromise(controller.authenticate(email, password))
})

