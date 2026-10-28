import { Consulta, EstadoConsulta } from "../../domain/entities";
import { ConsultaRepository, Pagina, Paginacion } from "../../domain/repositories";
import { prisma } from "./client";
import { conPrisma } from "./errores";

const incluir = {
  instrumento: { select: { id: true, nombre: true, foto: true } },
  user: { select: { id: true, nombre: true, email: true } },
} as const;

export class ConsultaPrismaRepository implements ConsultaRepository {
  crear(datos: { userId: number; instrumentoId: number; mensaje: string }): Promise<Consulta> {
    return conPrisma(() => prisma.consulta.create({ data: datos, include: incluir }));
  }

  listarPorUsuario(userId: number, p: Paginacion): Promise<Pagina<Consulta>> {
    return this.listar({ userId }, p);
  }

  listarTodas(p: Paginacion): Promise<Pagina<Consulta>> {
    return this.listar({}, p);
  }

  buscarPorId(id: number): Promise<Consulta | null> {
    return conPrisma(() => prisma.consulta.findUnique({ where: { id }, include: incluir }));
  }

  actualizarEstado(id: number, estado: EstadoConsulta): Promise<Consulta> {
    return conPrisma(() => prisma.consulta.update({ where: { id }, data: { estado }, include: incluir }));
  }

  async eliminar(id: number): Promise<void> {
    await conPrisma(() => prisma.consulta.delete({ where: { id } }));
  }

  private listar(where: { userId?: number }, p: Paginacion): Promise<Pagina<Consulta>> {
    return conPrisma(async () => {
      const [items, total] = await prisma.$transaction([
        prisma.consulta.findMany({
          where,
          include: incluir,
          orderBy: { createdAt: "desc" },
          skip: (p.page - 1) * p.limit,
          take: p.limit,
        }),
        prisma.consulta.count({ where }),
      ]);
      return { items, total };
    });
  }
}
