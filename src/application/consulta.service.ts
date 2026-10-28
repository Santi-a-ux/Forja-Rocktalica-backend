import { Consulta, EstadoConsulta } from "../domain/entities";
import { noEncontrado, prohibido, solicitudInvalida } from "../domain/errors";
import { ConsultaRepository, InstrumentoRepository, Paginacion } from "../domain/repositories";
import { armarPaginado, AuthUser, Paginado } from "./ports";

export class ConsultaService {
  constructor(
    private readonly consultas: ConsultaRepository,
    private readonly instrumentos: InstrumentoRepository,
  ) {}

  /** El autor SIEMPRE llega desde el token (actor), nunca desde el body. */
  async crear(actor: AuthUser, datos: { instrumentoId: number; mensaje: string }): Promise<Consulta> {
    const instrumento = await this.instrumentos.buscarPorId(datos.instrumentoId);
    if (!instrumento) {
      throw solicitudInvalida("El instrumento indicado no existe", [
        { campo: "instrumentoId", mensaje: "El instrumento indicado no existe" },
      ]);
    }
    return this.consultas.crear({ userId: actor.id, instrumentoId: datos.instrumentoId, mensaje: datos.mensaje });
  }

  async mias(actor: AuthUser, p: Paginacion): Promise<Paginado<Consulta>> {
    const { items, total } = await this.consultas.listarPorUsuario(actor.id, p);
    return armarPaginado(items, total, p.page, p.limit);
  }

  async todas(p: Paginacion): Promise<Paginado<Consulta>> {
    const { items, total } = await this.consultas.listarTodas(p);
    return armarPaginado(items, total, p.page, p.limit);
  }

  async cambiarEstado(id: number, estado: EstadoConsulta): Promise<Consulta> {
    const consulta = await this.consultas.buscarPorId(id);
    if (!consulta) throw noEncontrado("Consulta");
    return this.consultas.actualizarEstado(id, estado);
  }

  /** Un usuario solo borra las suyas; un admin puede borrar cualquiera. */
  async eliminar(actor: AuthUser, id: number): Promise<void> {
    const consulta = await this.consultas.buscarPorId(id);
    if (!consulta) throw noEncontrado("Consulta");
    if (actor.role !== "admin" && consulta.userId !== actor.id) throw prohibido();
    await this.consultas.eliminar(id);
  }
}
