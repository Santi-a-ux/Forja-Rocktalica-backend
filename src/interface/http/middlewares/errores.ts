import { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../../../domain/errors";

export const rutaNoEncontrada: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { codigo: "RUTA_NO_ENCONTRADA", mensaje: "La ruta solicitada no existe" } });
};

// Express exige los 4 parámetros para reconocer un manejador de errores.
export const manejarErrores: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: { codigo: err.codigo, mensaje: err.message, detalles: err.detalles },
    });
    return;
  }
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: { codigo: "JSON_INVALIDO", mensaje: "El cuerpo de la solicitud no es un JSON válido" } });
    return;
  }
  // El detalle (con stack) queda solo en el log del servidor; el cliente recibe un mensaje genérico.
  console.error(err);
  res.status(500).json({ error: { codigo: "ERROR_INTERNO", mensaje: "Ocurrió un error inesperado" } });
};
