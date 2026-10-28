import { Role } from "../domain/entities";

/** Lo único que viaja dentro del JWT: id y rol. */
export interface AuthUser {
  id: number;
  role: Role;
}

export interface PasswordHasher {
  hash(plano: string): Promise<string>;
  compare(plano: string, hash: string): Promise<boolean>;
}

export interface TokenService {
  firmar(usuario: AuthUser): string;
  /** Lanza un error si el token es inválido o expiró. */
  verificar(token: string): AuthUser;
}

export interface PaginacionRespuesta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginado<T> {
  pagination: PaginacionRespuesta;
  data: T[];
}

export function armarPaginado<T>(items: T[], total: number, page: number, limit: number): Paginado<T> {
  return {
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    data: items,
  };
}
