import { User, UserConPassword } from "../domain/entities";
import { AppError } from "../domain/errors";
import { UserRepository } from "../domain/repositories";
import { PasswordHasher, TokenService } from "./ports";

export interface RespuestaAuth {
  token: string;
  user: User;
}

function usuarioPublico(u: UserConPassword): User {
  // Se arma el objeto campo por campo para que el hash NUNCA salga en una respuesta.
  return { id: u.id, nombre: u.nombre, email: u.email, role: u.role, createdAt: u.createdAt };
}

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async registrar(datos: { nombre: string; email: string; password: string }): Promise<RespuestaAuth> {
    const email = datos.email.toLowerCase();
    const existente = await this.users.buscarPorEmail(email);
    if (existente) {
      throw new AppError(409, "EMAIL_DUPLICADO", "Ya existe una cuenta con ese correo", [
        { campo: "email", mensaje: "Este correo ya está registrado" },
      ]);
    }
    const hash = await this.hasher.hash(datos.password);
    // Todo registro público nace con rol "user". El rol admin solo lo crea el seed.
    const user = await this.users.crear({ nombre: datos.nombre, email, password: hash, role: "user" });
    return { token: this.tokens.firmar({ id: user.id, role: user.role }), user };
  }

  async ingresar(email: string, password: string): Promise<RespuestaAuth> {
    const encontrado = await this.users.buscarPorEmail(email.toLowerCase());
    const coincide = encontrado ? await this.hasher.compare(password, encontrado.password) : false;
    if (!encontrado || !coincide) {
      // Mismo mensaje para "no existe el correo" y "contraseña incorrecta".
      throw new AppError(401, "CREDENCIALES_INVALIDAS", "Credenciales inválidas");
    }
    const user = usuarioPublico(encontrado);
    return { token: this.tokens.firmar({ id: user.id, role: user.role }), user };
  }

  async perfil(id: number): Promise<User> {
    const user = await this.users.buscarPorId(id);
    if (!user) throw new AppError(401, "NO_AUTENTICADO", "La sesión ya no es válida");
    return user;
  }
}
