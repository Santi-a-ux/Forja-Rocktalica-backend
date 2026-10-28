export type Role = "admin" | "user";
export type Categoria = "Guitarra" | "Bajo" | "Amplificador" | "Pedal" | "Accesorios";
export type EstadoConsulta = "pendiente" | "atendida";

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface UserConPassword extends User {
  password: string;
}

export interface Marca {
  id: number;
  nombre: string;
  ciudad: string;
  especialidad: string;
  bio: string;
  foto: string;
  alt: string;
}

export interface Instrumento {
  id: number;
  nombre: string;
  categoria: Categoria;
  precio: number;
  descripcion: string;
  foto: string;
  alt: string;
  marcaId: number;
  createdAt: Date;
  marca?: Marca;
}

export interface Consulta {
  id: number;
  mensaje: string;
  estado: EstadoConsulta;
  createdAt: Date;
  userId: number;
  instrumentoId: number;
  instrumento?: { id: number; nombre: string; foto: string };
  user?: { id: number; nombre: string; email: string };
}
