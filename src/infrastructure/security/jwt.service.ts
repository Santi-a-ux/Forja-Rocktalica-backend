import jwt, { SignOptions } from "jsonwebtoken";
import { AuthUser, TokenService } from "../../application/ports";
import { env } from "../config/env";

export class JwtTokenService implements TokenService {
  firmar(usuario: AuthUser): string {
    // Payload mínimo: solo id y rol. El payload se puede leer sin la clave.
    return jwt.sign({ id: usuario.id, role: usuario.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    });
  }

  verificar(token: string): AuthUser {
    const payload = jwt.verify(token, env.jwtSecret);
    if (
      typeof payload === "string" ||
      typeof payload.id !== "number" ||
      (payload.role !== "admin" && payload.role !== "user")
    ) {
      throw new Error("Payload inválido");
    }
    return { id: payload.id, role: payload.role };
  }
}
