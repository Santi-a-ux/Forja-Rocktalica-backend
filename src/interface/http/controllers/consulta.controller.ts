import { ConsultaService } from "../../../application/consulta.service";
import { EstadoConsulta } from "../../../domain/entities";
import { asyncHandler } from "../async-handler";
import { PaginacionQuery } from "../schemas";

export function crearConsultaController(service: ConsultaService) {
  return {
    crear: asyncHandler(async (req, res) => {
      const { instrumentoId, mensaje } = req.body as { instrumentoId: number; mensaje: string };
      // El autor sale del token (req.user), nunca del body.
      res.status(201).json(await service.crear(req.user!, { instrumentoId, mensaje }));
    }),
    mias: asyncHandler(async (req, res) => {
      res.json(await service.mias(req.user!, res.locals.query as PaginacionQuery));
    }),
    todas: asyncHandler(async (_req, res) => {
      res.json(await service.todas(res.locals.query as PaginacionQuery));
    }),
    cambiarEstado: asyncHandler(async (req, res) => {
      const { estado } = req.body as { estado: EstadoConsulta };
      res.json(await service.cambiarEstado(Number(req.params.id), estado));
    }),
    eliminar: asyncHandler(async (req, res) => {
      await service.eliminar(req.user!, Number(req.params.id));
      res.status(204).send();
    }),
  };
}
