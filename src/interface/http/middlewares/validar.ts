import { Request, RequestHandler } from "express";
import { ZodTypeAny } from "zod";
import { AppError } from "../../../domain/errors";

type Fuente = "body" | "params" | "query";

/**
 * Valida body, params o query con un esquema de zod. Si falla responde 400 con el detalle por campo.
 * Los datos ya validados/convertidos quedan en req.body, req.params o res.locals.query.
 */
export const validar =
  (fuente: Fuente, esquema: ZodTypeAny): RequestHandler =>
  (req, res, next) => {
    const resultado = esquema.safeParse(req[fuente]);
    if (!resultado.success) {
      const detalles = resultado.error.issues.map((i) => ({
        campo: i.path.join(".") || fuente,
        mensaje: i.message,
      }));
      return next(new AppError(400, "VALIDACION", "Hay datos inválidos en la solicitud", detalles));
    }
    if (fuente === "query") {
      res.locals.query = resultado.data;
    } else if (fuente === "params") {
      req.params = resultado.data as Request["params"];
    } else {
      req.body = resultado.data;
    }
    next();
  };
