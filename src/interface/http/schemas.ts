import { z } from "zod";

// Mensajes de validación en español
z.setErrorMap((issue, ctx) => {
  if (issue.code === "invalid_type") {
    return { message: issue.received === "undefined" ? "Este campo es obligatorio" : "El tipo de dato no es válido" };
  }
  if (issue.code === "too_small" && issue.type === "string") {
    return { message: `Debe tener al menos ${issue.minimum} caracteres` };
  }
  if (issue.code === "too_big" && issue.type === "string") {
    return { message: `No puede superar los ${issue.maximum} caracteres` };
  }
  if (issue.code === "invalid_string" && issue.validation === "email") {
    return { message: "El correo no tiene un formato válido" };
  }
  if (issue.code === "invalid_enum_value") {
    return { message: `Valor no permitido. Opciones: ${issue.options.join(", ")}` };
  }
  return { message: ctx.defaultError };
});

const categorias = ["Guitarra", "Bajo", "Amplificador", "Pedal", "Accesorios"] as const;

export const idParam = z.object({ id: z.coerce.number().int().positive() });

export const registroBody = z.object({
  nombre: z.string().trim().min(3).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  // bcrypt solo usa los primeros 72 bytes
  password: z.string().min(8).max(72),
});

export const loginBody = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Escribe tu contraseña").max(72),
});

export const instrumentosQuery = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(9),
    categoria: z.enum(categorias).optional(),
    q: z.string().trim().max(60).optional(),
    minPrecio: z.coerce.number().int().min(0).optional(),
    maxPrecio: z.coerce.number().int().min(0).optional(),
    marcaId: z.coerce.number().int().positive().optional(),
  })
  .refine((q) => q.minPrecio === undefined || q.maxPrecio === undefined || q.minPrecio <= q.maxPrecio, {
    message: "El precio mínimo no puede ser mayor que el máximo",
    path: ["minPrecio"],
  });

export const paginacionQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const instrumentoBody = z.object({
  nombre: z.string().trim().min(3).max(120),
  categoria: z.enum(categorias),
  precio: z.coerce.number().int().positive("El precio debe ser mayor que 0"),
  descripcion: z.string().trim().min(10).max(1000),
  foto: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(3).max(200),
  marcaId: z.coerce.number().int().positive(),
});

export const instrumentoActualizacionBody = instrumentoBody
  .partial()
  .refine((d) => Object.keys(d).length > 0, { message: "Envía al menos un campo para actualizar" });

export const consultaBody = z.object({
  instrumentoId: z.coerce.number().int().positive("Elige un instrumento"),
  mensaje: z.string().trim().min(20).max(1000),
});

export const estadoBody = z.object({ estado: z.enum(["pendiente", "atendida"]) });

export type InstrumentosQuery = z.infer<typeof instrumentosQuery>;
export type PaginacionQuery = z.infer<typeof paginacionQuery>;
