import { User, UserConPassword } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";
import { prisma } from "./client";
import { conPrisma } from "./errores";

const seleccionPublica = { id: true, nombre: true, email: true, role: true, createdAt: true } as const;

export class UserPrismaRepository implements UserRepository {
  buscarPorEmail(email: string): Promise<UserConPassword | null> {
    return conPrisma(() => prisma.user.findUnique({ where: { email } }));
  }

  buscarPorId(id: number): Promise<User | null> {
    return conPrisma(() => prisma.user.findUnique({ where: { id }, select: seleccionPublica }));
  }

  crear(datos: { nombre: string; email: string; password: string; role: "admin" | "user" }): Promise<User> {
    return conPrisma(() => prisma.user.create({ data: datos, select: seleccionPublica }));
  }
}
