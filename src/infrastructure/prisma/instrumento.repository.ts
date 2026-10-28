import { Prisma } from "@prisma/client";
import { Instrumento } from "../../domain/entities";
import {
  DatosInstrumento,
  FiltrosInstrumento,
  InstrumentoRepository,
  Pagina,
} from "../../domain/repositories";
import { prisma } from "./client";
import { conPrisma } from "./errores";

export class InstrumentoPrismaRepository implements InstrumentoRepository {
  listar(f: FiltrosInstrumento): Promise<Pagina<Instrumento>> {
    const where: Prisma.InstrumentoWhereInput = {
      ...(f.categoria && { categoria: f.categoria }),
      ...(f.marcaId && { marcaId: f.marcaId }),
      ...(f.q && {
        OR: [
          { nombre: { contains: f.q, mode: "insensitive" } },
          { descripcion: { contains: f.q, mode: "insensitive" } },
        ],
      }),
      ...((f.minPrecio !== undefined || f.maxPrecio !== undefined) && {
        precio: { gte: f.minPrecio, lte: f.maxPrecio },
      }),
    };

    return conPrisma(async () => {
      const [items, total] = await prisma.$transaction([
        prisma.instrumento.findMany({
          where,
          include: { marca: true },
          orderBy: { id: "asc" },
          skip: (f.page - 1) * f.limit,
          take: f.limit,
        }),
        prisma.instrumento.count({ where }),
      ]);
      return { items, total };
    });
  }

  buscarPorId(id: number): Promise<Instrumento | null> {
    return conPrisma(() => prisma.instrumento.findUnique({ where: { id }, include: { marca: true } }));
  }

  crear(datos: DatosInstrumento): Promise<Instrumento> {
    return conPrisma(() => prisma.instrumento.create({ data: datos, include: { marca: true } }));
  }

  actualizar(id: number, datos: Partial<DatosInstrumento>): Promise<Instrumento> {
    return conPrisma(() => prisma.instrumento.update({ where: { id }, data: datos, include: { marca: true } }));
  }

  async eliminar(id: number): Promise<void> {
    await conPrisma(() => prisma.instrumento.delete({ where: { id } }));
  }
}
