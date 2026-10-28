import { Router } from "express";
import { crearMarcaController } from "../controllers/marca.controller";

export function crearMarcaRouter(controller: ReturnType<typeof crearMarcaController>): Router {
  const router = Router();
  router.get("/", controller.listar);
  return router;
}
