import { Marca } from "../../domain/entities";
import { MarcaRepository } from "../../domain/repositories";
import { prisma } from "./client";
import { conPrisma } from "./errores";

export class MarcaPrismaRepository implements MarcaRepository {
  listar(): Promise<Marca[]> {
    return conPrisma(() => prisma.marca.findMany({ orderBy: { id: "asc" } }));
  }

  buscarPorId(id: number): Promise<Marca | null> {
    return conPrisma(() => prisma.marca.findUnique({ where: { id } }));
  }
}
