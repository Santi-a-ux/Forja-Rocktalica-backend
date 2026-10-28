import { RequestHandler } from "express";
import { TokenService } from "../../../application/ports";
import { AppError } from "../../../domain/errors";

/**
 * Middleware de autenticación centralizado: lee "Authorization: Bearer <token>", lo verifica
 * y deja el usuario en req.user. Sin token, o con token inválido/expirado → 401.
 */
export function crearAutenticar(tokens: TokenService): RequestHandler {
  return (req, _res, next) => {
    const cabecera = req.headers.authorization;
    if (!cabecera || !cabecera.startsWith("Bearer ")) {
      return next(new AppError(401, "NO_AUTENTICADO", "Debes iniciar sesión para continuar"));
    }
    const token = cabecera.slice("Bearer ".length).trim();
    try {
      req.user = tokens.verificar(token);
    } catch {
      return next(new AppError(401, "TOKEN_INVALIDO", "El token es inválido o ya expiró"));
    }
    next();
  };
}
