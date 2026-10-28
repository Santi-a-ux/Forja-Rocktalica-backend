import bcrypt from "bcryptjs";
import { PasswordHasher } from "../../application/ports";

const RONDAS = 10;

export class BcryptHasher implements PasswordHasher {
  hash(plano: string): Promise<string> {
    return bcrypt.hash(plano, RONDAS);
  }

  compare(plano: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plano, hash);
  }
}
