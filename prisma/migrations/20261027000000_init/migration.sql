-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('Guitarra', 'Bajo', 'Amplificador', 'Pedal', 'Accesorios');

-- CreateEnum
CREATE TYPE "EstadoConsulta" AS ENUM ('pendiente', 'atendida');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marca" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "alt" TEXT NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrumento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "precio" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "marcaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instrumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" SERIAL NOT NULL,
    "mensaje" TEXT NOT NULL,
    "estado" "EstadoConsulta" NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "instrumentoId" INTEGER NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_nombre_key" ON "Marca"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Instrumento_nombre_key" ON "Instrumento"("nombre");

-- CreateIndex
CREATE INDEX "Instrumento_categoria_idx" ON "Instrumento"("categoria");

-- CreateIndex
CREATE INDEX "Consulta_userId_idx" ON "Consulta"("userId");

-- CreateIndex
CREATE INDEX "Consulta_instrumentoId_idx" ON "Consulta"("instrumentoId");

-- AddForeignKey
ALTER TABLE "Instrumento" ADD CONSTRAINT "Instrumento_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

