import cors from "cors";
import express from "express";
import helmet from "helmet";
import { container } from "./container";
import { env } from "./infrastructure/config/env";
import { crearAuthController } from "./interface/http/controllers/auth.controller";
import { crearConsultaController } from "./interface/http/controllers/consulta.controller";
import { crearInstrumentoController } from "./interface/http/controllers/instrumento.controller";
import { crearMarcaController } from "./interface/http/controllers/marca.controller";
import { crearAutenticar } from "./interface/http/middlewares/autenticacion";
import { manejarErrores, rutaNoEncontrada } from "./interface/http/middlewares/errores";
import { soloAdmin } from "./interface/http/middlewares/roles";
import { crearAuthRouter } from "./interface/http/routes/auth.routes";
import { crearConsultaRouter } from "./interface/http/routes/consulta.routes";
import { crearInstrumentoRouter } from "./interface/http/routes/instrumento.routes";
import { crearMarcaRouter } from "./interface/http/routes/marca.routes";

export function crearApp(): express.Express {
  const app = express();
  const autenticar = crearAutenticar(container.tokens);

  app.use(helmet());
  // CORS solo con la(s) URL(s) del frontend, nunca "*"
  app.use(cors({ origin: env.corsOrigins }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_req, res) => {
    res.json({ estado: "ok" });
  });

  app.use("/api/auth", crearAuthRouter(crearAuthController(container.authService), autenticar));
  app.use("/api/marcas", crearMarcaRouter(crearMarcaController(container.marcaService)));
  app.use(
    "/api/instrumentos",
    crearInstrumentoRouter(crearInstrumentoController(container.instrumentoService), autenticar, soloAdmin),
  );
  app.use(
    "/api/consultas",
    crearConsultaRouter(crearConsultaController(container.consultaService), autenticar, soloAdmin),
  );

  app.use(rutaNoEncontrada);
  app.use(manejarErrores);
  return app;
}
