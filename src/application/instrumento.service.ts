import { Instrumento } from "../domain/entities";
import { noEncontrado, solicitudInvalida } from "../domain/errors";
import {
  DatosInstrumento,
  FiltrosInstrumento,
  InstrumentoRepository,
  MarcaRepository,
} from "../domain/repositories";
import { armarPaginado, Paginado } from "./ports";

export class InstrumentoService {
  constructor(
    private readonly instrumentos: InstrumentoRepository,
    private readonly marcas: MarcaRepository,
  ) {}

  async listar(filtros: FiltrosInstrumento): Promise<Paginado<Instrumento>> {
    const { items, total } = await this.instrumentos.listar(filtros);
    return armarPaginado(items, total, filtros.page, filtros.limit);
  }

  async obtener(id: number): Promise<Instrumento> {
    const instrumento = await this.instrumentos.buscarPorId(id);
    if (!instrumento) throw noEncontrado("Instrumento");
    return instrumento;
  }

  async crear(datos: DatosInstrumento): Promise<Instrumento> {
    await this.verificarMarca(datos.marcaId);
    return this.instrumentos.crear(datos);
  }

  async actualizar(id: number, datos: Partial<DatosInstrumento>): Promise<Instrumento> {
    await this.obtener(id);
    if (datos.marcaId !== undefined) await this.verificarMarca(datos.marcaId);
    return this.instrumentos.actualizar(id, datos);
  }

  async eliminar(id: number): Promise<void> {
    await this.obtener(id);
    await this.instrumentos.eliminar(id);
  }

  private async verificarMarca(marcaId: number): Promise<void> {
    const marca = await this.marcas.buscarPorId(marcaId);
    if (!marca) {
      throw solicitudInvalida("La marca indicada no existe", [
        { campo: "marcaId", mensaje: "La marca indicada no existe" },
      ]);
    }
  }
}
