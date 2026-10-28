import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import type { AuthUser, TokenService } from "../src/application/ports";
import { AppError } from "../src/domain/errors";
import { crearAutenticar } from "../src/interface/http/middlewares/autenticacion";
import { soloAdmin } from "../src/interface/http/middlewares/roles";

// Servicio de tokens falso: solo reconoce dos tokens
const tokensFalsos: TokenService = {
  firmar: () => "no-se-usa",
  verificar: (token: string): AuthUser => {
    if (token === "token-admin") return { id: 1, role: "admin" };
    if (token === "token-user") return { id: 2, role: "user" };
    throw new Error("token inválido");
  },
};

function pedido(datos: { authorization?: string; user?: AuthUser }): Request {
  return { headers: { authorization: datos.authorization }, user: datos.user } as unknown as Request;
}

function ejecutar(
  middleware: (req: Request, res: Response, next: NextFunction) => void,
  req: Request,
): ReturnType<typeof vi.fn> {
  const next = vi.fn();
  middleware(req, {} as Response, next);
  return next;
}

function errorDe(next: ReturnType<typeof vi.fn>): AppError {
  return next.mock.calls[0][0] as AppError;
}

describe("middleware de autenticación", () => {
  const autenticar = crearAutenticar(tokensFalsos);

  it("sin cabecera Authorization responde 401", () => {
    const next = ejecutar(autenticar, pedido({}));
    expect(errorDe(next).status).toBe(401);
  });

  it("con un esquema distinto a Bearer responde 401", () => {
    const next = ejecutar(autenticar, pedido({ authorization: "Basic abc" }));
    expect(errorDe(next).status).toBe(401);
  });

  it("con token inválido o expirado responde 401", () => {
    const next = ejecutar(autenticar, pedido({ authorization: "Bearer cualquier-cosa" }));
    expect(errorDe(next).status).toBe(401);
  });

  it("con token válido deja el usuario en req.user y continúa", () => {
    const req = pedido({ authorization: "Bearer token-user" });
    const next = ejecutar(autenticar, req);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({ id: 2, role: "user" });
  });
});

describe("middleware de rol (soloAdmin)", () => {
  it("sin usuario autenticado responde 401", () => {
    const next = ejecutar(soloAdmin, pedido({}));
    expect(errorDe(next).status).toBe(401);
  });

  it("usuario con rol user responde 403", () => {
    const next = ejecutar(soloAdmin, pedido({ user: { id: 2, role: "user" } }));
    expect(errorDe(next).status).toBe(403);
  });

  it("usuario admin continúa sin error", () => {
    const next = ejecutar(soloAdmin, pedido({ user: { id: 1, role: "admin" } }));
    expect(next).toHaveBeenCalledWith();
  });
});
