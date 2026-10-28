import { MarcaService } from "../../../application/marca.service";
import { asyncHandler } from "../async-handler";

export function crearMarcaController(service: MarcaService) {
  return {
    listar: asyncHandler(async (_req, res) => {
      res.json({ data: await service.listar() });
    }),
  };
}
