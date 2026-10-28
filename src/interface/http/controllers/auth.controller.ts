import { AuthService } from "../../../application/auth.service";
import { asyncHandler } from "../async-handler";

export function crearAuthController(service: AuthService) {
  return {
    registro: asyncHandler(async (req, res) => {
      const { nombre, email, password } = req.body as { nombre: string; email: string; password: string };
      res.status(201).json(await service.registrar({ nombre, email, password }));
    }),
    login: asyncHandler(async (req, res) => {
      const { email, password } = req.body as { email: string; password: string };
      res.json(await service.ingresar(email, password));
    }),
    perfil: asyncHandler(async (req, res) => {
      // req.user lo puso el middleware de autenticación
      res.json(await service.perfil(req.user!.id));
    }),
  };
}
