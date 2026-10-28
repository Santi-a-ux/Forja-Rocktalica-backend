import { Marca } from "../domain/entities";
import { MarcaRepository } from "../domain/repositories";

export class MarcaService {
  constructor(private readonly marcas: MarcaRepository) {}

  listar(): Promise<Marca[]> {
    return this.marcas.listar();
  }
}
