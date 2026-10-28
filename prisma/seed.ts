import { Categoria, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Datos reales de la Entrega 1 (js/datos.js). Las fotos viven en el frontend: public/img/
const marcas = [
  {
    nombre: "Fender",
    ciudad: "California, Estados Unidos",
    especialidad: "Guitarras eléctricas y bajos",
    bio: "Marca reconocida por sus guitarras y bajos eléctricos, especialmente por modelos como Stratocaster, Telecaster, Precision Bass y Jazz Bass.",
    foto: "/img/fender-stratocaster.jpg",
    alt: "Guitarra eléctrica Fender Stratocaster",
  },
  {
    nombre: "Gibson",
    ciudad: "Nashville, Estados Unidos",
    especialidad: "Guitarras eléctricas de cuerpo sólido",
    bio: "Fabricante histórico de guitarras eléctricas reconocido por modelos como Les Paul, SG y Explorer, utilizados ampliamente en rock y metal.",
    foto: "/img/gibson-les-paul.jpg",
    alt: "Guitarra eléctrica Gibson Les Paul",
  },
  {
    nombre: "Ibanez",
    ciudad: "Nagoya, Japón",
    especialidad: "Guitarras de 7 cuerdas y metal",
    bio: "Marca japonesa especializada en guitarras eléctricas orientadas al rock y metal, con modelos de siete y ocho cuerdas y diseños de alta velocidad.",
    foto: "/img/ibanez-rg7421.jpg",
    alt: "Guitarra eléctrica Ibanez de siete cuerdas",
  },
  {
    nombre: "Marshall",
    ciudad: "Milton Keynes, Reino Unido",
    especialidad: "Amplificadores para rock y metal",
    bio: "Fabricante británico de amplificadores reconocido por su sonido de alta ganancia y por su influencia histórica en el desarrollo del sonido del rock.",
    foto: "/img/marshall-dsl40cr.jpg",
    alt: "Amplificador Marshall para guitarra",
  },
];

interface InstrumentoSeed {
  nombre: string;
  categoria: Categoria;
  marca: string;
  precio: number;
  descripcion: string;
  foto: string;
  alt: string;
}

const instrumentos: InstrumentoSeed[] = [
  {
    nombre: "Fender Player Stratocaster",
    categoria: "Guitarra",
    marca: "Fender",
    precio: 4200000,
    descripcion: "Guitarra eléctrica de cuerpo sólido con tres pastillas single-coil, puente tremolo de dos puntos y perfil de mástil moderno. Ideal para rock, blues y estilos derivados.",
    foto: "/img/fender-stratocaster.jpg",
    alt: "Guitarra eléctrica Fender Player Stratocaster",
  },
  {
    nombre: "Gibson Les Paul Standard",
    categoria: "Guitarra",
    marca: "Gibson",
    precio: 14500000,
    descripcion: "Guitarra eléctrica de cuerpo sólido con construcción de caoba y tapa de arce, equipada con dos humbuckers y un sonido potente pensado para rock y hard rock.",
    foto: "/img/gibson-les-paul.jpg",
    alt: "Guitarra eléctrica Gibson Les Paul Standard",
  },
  {
    nombre: "Ibanez RG7421",
    categoria: "Guitarra",
    marca: "Ibanez",
    precio: 5200000,
    descripcion: "Guitarra eléctrica de siete cuerdas diseñada para estilos modernos y metal, con configuración de humbuckers y una escala pensada para una ejecución rápida.",
    foto: "/img/ibanez-rg7421.jpg",
    alt: "Guitarra eléctrica Ibanez de siete cuerdas",
  },
  {
    nombre: "Fender Player Precision Bass",
    categoria: "Bajo",
    marca: "Fender",
    precio: 4500000,
    descripcion: "Bajo eléctrico de cuatro cuerdas con pastilla split-coil, conocido por sus graves definidos y su presencia característica en rock y otros géneros musicales.",
    foto: "/img/fender-precision-bass.jpg",
    alt: "Bajo eléctrico Fender Precision Bass",
  },
  {
    nombre: "Ibanez SR505E",
    categoria: "Bajo",
    marca: "Ibanez",
    precio: 5900000,
    descripcion: "Bajo eléctrico de cinco cuerdas con electrónica activa y configuración orientada a obtener una respuesta definida para rock, metal y otros estilos modernos.",
    foto: "/img/ibanez-sr505e.jpg",
    alt: "Bajo eléctrico Ibanez de cinco cuerdas",
  },
  {
    nombre: "Marshall DSL40CR",
    categoria: "Amplificador",
    marca: "Marshall",
    precio: 5800000,
    descripcion: "Amplificador de guitarra a válvulas de 40 W con dos canales, ecualización de tres bandas y diferentes opciones de ganancia para sonidos limpios y de alta saturación.",
    foto: "/img/marshall-dsl40cr.jpg",
    alt: "Amplificador Marshall DSL40CR",
  },
  {
    nombre: "Marshall MG30GFX",
    categoria: "Amplificador",
    marca: "Marshall",
    precio: 1800000,
    descripcion: "Amplificador de guitarra de 30 W con canales limpios y overdrive, efectos integrados y controles diseñados para práctica y presentaciones pequeñas.",
    foto: "/img/marshall-mg30gfx.jpg",
    alt: "Amplificador Marshall MG30GFX",
  },
  {
    nombre: "Ibanez Tube Screamer TS9",
    categoria: "Pedal",
    marca: "Ibanez",
    precio: 850000,
    descripcion: "Pedal de overdrive clásico utilizado para añadir saturación y realzar medios. Es habitual como efecto independiente o como impulso para amplificadores de alta ganancia.",
    foto: "/img/ibanez-ts9.jpg",
    alt: "Pedal Ibanez Tube Screamer TS9",
  },
  {
    nombre: "Kit de púas Forja Rocktalica",
    categoria: "Accesorios",
    marca: "Fender",
    precio: 35000,
    descripcion: "Set de púas de diferentes calibres para guitarra eléctrica y bajo, pensado para practicar diferentes técnicas de interpretación.",
    foto: "/img/kit-puas.jpg",
    alt: "Kit de púas para guitarra y bajo",
  },
];

async function main(): Promise<void> {
  // Usuarios de prueba (SOLO para el ambiente de la entrega)
  const [claveAdmin, claveUser] = await Promise.all([bcrypt.hash("Admin12345", 10), bcrypt.hash("User12345", 10)]);

  await prisma.user.upsert({
    where: { email: "admin@forja.com" },
    update: {},
    create: { nombre: "Administrador Forja", email: "admin@forja.com", password: claveAdmin, role: "admin" },
  });
  await prisma.user.upsert({
    where: { email: "user@forja.com" },
    update: {},
    create: { nombre: "Usuario de Prueba", email: "user@forja.com", password: claveUser, role: "user" },
  });

  // Marcas
  const idPorMarca = new Map<string, number>();
  for (const marca of marcas) {
    const guardada = await prisma.marca.upsert({ where: { nombre: marca.nombre }, update: marca, create: marca });
    idPorMarca.set(marca.nombre, guardada.id);
  }

  // Instrumentos
  for (const { marca, ...datos } of instrumentos) {
    const marcaId = idPorMarca.get(marca);
    if (marcaId === undefined) throw new Error(`Marca no encontrada en el seed: ${marca}`);
    await prisma.instrumento.upsert({
      where: { nombre: datos.nombre },
      update: { ...datos, marcaId },
      create: { ...datos, marcaId },
    });
  }

  console.log("Seed listo: 2 usuarios, 4 marcas y 9 instrumentos.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
