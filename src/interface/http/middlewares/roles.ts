import { RequestHandler } from "express";
import { Role } from "../../../domain/entities";
import { AppError } from "../../../domain/errors";

/** Se usa DESPUÉS del middleware de autenticación. Token válido pero sin el rol → 403. */
export const requiereRol =
  (rol: Role): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, "NO_AUTENTICADO", "Debes iniciar sesión para continuar"));
    }
    if (req.user.role !== rol) {
      return next(new AppError(403, "PROHIBIDO", "No tienes permiso para realizar esta acción"));
    }
    next();
  };

export const soloAdmin = requiereRol("admin");
