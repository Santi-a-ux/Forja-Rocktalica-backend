import { Prisma } from "@prisma/client";
import { AppError } from "../../domain/errors";

/** Traduce los errores conocidos de Prisma a errores HTTP; el resto se relanza (→ 500 genérico). */
export function traducirErrorPrisma(error: unknown): unknown {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const objetivo = error.meta?.target;
        const campo = Array.isArray(objetivo) ? String(objetivo[0]) : "valor";
        return new AppError(409, "DUPLICADO", "Ya existe un registro con ese valor", [
          { campo, mensaje: "Ya existe un registro con ese valor" },
        ]);
      }
      case "P2025":
        return new AppError(404, "NO_ENCONTRADO", "El registro no existe");
      case "P2003":
        return new AppError(
          409,
          "REGISTROS_RELACIONADOS",
          "No se puede completar la operación porque hay registros relacionados",
        );
    }
  }
  return error;
}

export async function conPrisma<T>(operacion: () => Promise<T>): Promise<T> {
  try {
    return await operacion();
  } catch (error) {
    throw traducirErrorPrisma(error);
  }
}
