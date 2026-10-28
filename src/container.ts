import { AuthService } from "./application/auth.service";
import { ConsultaService } from "./application/consulta.service";
import { InstrumentoService } from "./application/instrumento.service";
import { MarcaService } from "./application/marca.service";
import { ConsultaPrismaRepository } from "./infrastructure/prisma/consulta.repository";
import { InstrumentoPrismaRepository } from "./infrastructure/prisma/instrumento.repository";
import { MarcaPrismaRepository } from "./infrastructure/prisma/marca.repository";
import { UserPrismaRepository } from "./infrastructure/prisma/user.repository";
import { BcryptHasher } from "./infrastructure/security/bcrypt.hasher";
import { JwtTokenService } from "./infrastructure/security/jwt.service";

// Raíz de composición: único lugar donde se conectan las implementaciones con los servicios.
const tokens = new JwtTokenService();
const users = new UserPrismaRepository();
const marcas = new MarcaPrismaRepository();
const instrumentos = new InstrumentoPrismaRepository();
const consultas = new ConsultaPrismaRepository();

export const container = {
  tokens,
  authService: new AuthService(users, new BcryptHasher(), tokens),
  marcaService: new MarcaService(marcas),
  instrumentoService: new InstrumentoService(instrumentos, marcas),
  consultaService: new ConsultaService(consultas, instrumentos),
};
