import { RequestHandler, Router } from "express";
import { crearAuthController } from "../controllers/auth.controller";
import { validar } from "../middlewares/validar";
import { loginBody, registroBody } from "../schemas";

export function crearAuthRouter(
  controller: ReturnType<typeof crearAuthController>,
  autenticar: RequestHandler,
): Router {
  const router = Router();
  router.post("/register", validar("body", registroBody), controller.registro);
  router.post("/login", validar("body", loginBody), controller.login);
  router.get("/me", autenticar, controller.perfil);
  return router;
}
