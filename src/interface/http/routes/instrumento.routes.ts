import { RequestHandler, Router } from "express";
import { crearInstrumentoController } from "../controllers/instrumento.controller";
import { validar } from "../middlewares/validar";
import {
  idParam,
  instrumentoActualizacionBody,
  instrumentoBody,
  instrumentosQuery,
} from "../schemas";

export function crearInstrumentoRouter(
  controller: ReturnType<typeof crearInstrumentoController>,
  autenticar: RequestHandler,
  soloAdmin: RequestHandler,
): Router {
  const router = Router();

  // Públicas
  router.get("/", validar("query", instrumentosQuery), controller.listar);
  router.get("/:id", validar("params", idParam), controller.obtener);

  // Solo admin: primero autenticar (401), luego el rol (403)
  router.post("/", autenticar, soloAdmin, validar("body", instrumentoBody), controller.crear);
  router.put(
    "/:id",
    autenticar,
    soloAdmin,
    validar("params", idParam),
    validar("body", instrumentoActualizacionBody),
    controller.actualizar,
  );
  router.delete("/:id", autenticar, soloAdmin, validar("params", idParam), controller.eliminar);
  return router;
}
