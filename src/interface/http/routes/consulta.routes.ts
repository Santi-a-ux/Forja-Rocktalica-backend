import { RequestHandler, Router } from "express";
import { crearConsultaController } from "../controllers/consulta.controller";
import { validar } from "../middlewares/validar";
import { consultaBody, estadoBody, idParam, paginacionQuery } from "../schemas";

export function crearConsultaRouter(
  controller: ReturnType<typeof crearConsultaController>,
  autenticar: RequestHandler,
  soloAdmin: RequestHandler,
): Router {
  const router = Router();

  // Todas las rutas de consultas requieren sesión
  router.use(autenticar);

  router.post("/", validar("body", consultaBody), controller.crear);
  // "/mias" debe declararse antes de "/:id"
  router.get("/mias", validar("query", paginacionQuery), controller.mias);
  router.get("/", soloAdmin, validar("query", paginacionQuery), controller.todas);
  router.patch(
    "/:id/estado",
    soloAdmin,
    validar("params", idParam),
    validar("body", estadoBody),
    controller.cambiarEstado,
  );
  router.delete("/:id", validar("params", idParam), controller.eliminar);
  return router;
}
