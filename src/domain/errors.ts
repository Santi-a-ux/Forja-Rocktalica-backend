export interface DetalleError {
  campo: string;
  mensaje: string;
}

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly codigo: string,
    mensaje: string,
    public readonly detalles?: DetalleError[],
  ) {
    super(mensaje);
    this.name = "AppError";
  }
}

export const noEncontrado = (recurso: string): AppError =>
  new AppError(404, "NO_ENCONTRADO", `${recurso} no encontrado`);

export const solicitudInvalida = (mensaje: string, detalles?: DetalleError[]): AppError =>
  new AppError(400, "SOLICITUD_INVALIDA", mensaje, detalles);

export const prohibido = (mensaje = "No tienes permiso para realizar esta acción"): AppError =>
  new AppError(403, "PROHIBIDO", mensaje);
