import { InstrumentoService } from "../../../application/instrumento.service";
import { DatosInstrumento } from "../../../domain/repositories";
import { asyncHandler } from "../async-handler";
import { InstrumentosQuery } from "../schemas";

export function crearInstrumentoController(service: InstrumentoService) {
  return {
    listar: asyncHandler(async (_req, res) => {
      const q = res.locals.query as InstrumentosQuery;
      res.json(await service.listar({ ...q, q: q.q || undefined }));
    }),
    obtener: asyncHandler(async (req, res) => {
      res.json(await service.obtener(Number(req.params.id)));
    }),
    crear: asyncHandler(async (req, res) => {
      res.status(201).json(await service.crear(req.body as DatosInstrumento));
    }),
    actualizar: asyncHandler(async (req, res) => {
      res.json(await service.actualizar(Number(req.params.id), req.body as Partial<DatosInstrumento>));
    }),
    eliminar: asyncHandler(async (req, res) => {
      await service.eliminar(Number(req.params.id));
      res.status(204).send();
    }),
  };
}
