// tslint:disable: export-name no-unsafe-any
import { Request, Response, Router } from "express";
import { resolve } from "../../../domain/container/Container";
import AuthController from "../../../interfaces/controllers/AuthController";
import Fido2AuthController from "../../../interfaces/controllers/Fido2AuthController";

export const router = Router()

router.post('/authenticate', async (request: Request, response: Response) => {
  const { email, password } = request.body
  const controller = resolve<AuthController>("authController")
  response.sendPromise(controller.authenticate(email, password))
})

router.post('/request-register', async (request: Request, response: Response) => {
  const { email } = request.body
  const controller = resolve<Fido2AuthController>("fido2AuthController")
  response.sendPromise(controller.generateRegisterChallenge(email))
})

router.post('/register', async (request: Request, response: Response) => {
  var credentials = request.body
  const controller = resolve<Fido2AuthController>("fido2AuthController")
  response.sendPromise(controller.validateRegisterAttestation(credentials))
})

router.post('/login', async (request: Request, response: Response) => {
  const { email } = request.body
  const controller = resolve<Fido2AuthController>("fido2AuthController")
  response.sendPromise(controller.generateLoginChallenge(email))
})

router.post('/login-challenge', async (request: Request, response: Response) => {
  var credentials = request.body
  const controller = resolve<Fido2AuthController>("fido2AuthController")
  response.sendPromise(controller.validateLoginAssertion(credentials))
})
