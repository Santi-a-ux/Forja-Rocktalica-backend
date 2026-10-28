import { crearApp } from "./app";
import { env } from "./infrastructure/config/env";

crearApp().listen(env.port, () => {
  console.log(`API de Forja Rocktalica escuchando en el puerto ${env.port}`);
});
