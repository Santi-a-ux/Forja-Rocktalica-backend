import {
  Categoria,
  Consulta,
  EstadoConsulta,
  Instrumento,
  Marca,
  Role,
  User,
  UserConPassword,
} from "./entities";

export interface Paginacion {
  page: number;
  limit: number;
}

export interface FiltrosInstrumento extends Paginacion {
  categoria?: Categoria;
  q?: string;
  minPrecio?: number;
  maxPrecio?: number;
  marcaId?: number;
}

export interface DatosInstrumento {
  nombre: string;
  categoria: Categoria;
  precio: number;
  descripcion: string;
  foto: string;
  alt: string;
  marcaId: number;
}

export interface Pagina<T> {
  items: T[];
  total: number;
}

export interface UserRepository {
  buscarPorEmail(email: string): Promise<UserConPassword | null>;
  buscarPorId(id: number): Promise<User | null>;
  crear(datos: { nombre: string; email: string; password: string; role: Role }): Promise<User>;
}

export interface MarcaRepository {
  listar(): Promise<Marca[]>;
  buscarPorId(id: number): Promise<Marca | null>;
}

export interface InstrumentoRepository {
  listar(filtros: FiltrosInstrumento): Promise<Pagina<Instrumento>>;
  buscarPorId(id: number): Promise<Instrumento | null>;
  crear(datos: DatosInstrumento): Promise<Instrumento>;
  actualizar(id: number, datos: Partial<DatosInstrumento>): Promise<Instrumento>;
  eliminar(id: number): Promise<void>;
}

export interface ConsultaRepository {
  crear(datos: { userId: number; instrumentoId: number; mensaje: string }): Promise<Consulta>;
  listarPorUsuario(userId: number, p: Paginacion): Promise<Pagina<Consulta>>;
  listarTodas(p: Paginacion): Promise<Pagina<Consulta>>;
  buscarPorId(id: number): Promise<Consulta | null>;
  actualizarEstado(id: number, estado: EstadoConsulta): Promise<Consulta>;
  eliminar(id: number): Promise<void>;
}
