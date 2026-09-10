// src/app.ts
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

// ❗ Elige una de estas dos importaciones según cómo exporten tus rutas:

// 1) Si tus rutas ya están en TS y exportan `export default router`
import usuariosRouter from "./routes/usuarios.routes";
import projectRouter from "./routes/project.routes";
import categoriasRouter from "./routes/categorias.routes";
import productosRouter from "./routes/productos.routes";
import carritoRouter from "./routes/carrito.routes";
import ordenesRouter from "./routes/ordenes.routes";
import pagosRouter from "./routes/pagos.routes";

// 2) Si siguen en CommonJS (module.exports = router), usa:
// import usuariosRouter = require("./routes/usuarios");
// import projectRouter = require("./routes/project");

const app: Application = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "*",
  })
);

// Rutas
app.use("/api/usuarios", usuariosRouter);
app.use("/api/project", projectRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/productos", productosRouter);
app.use("/api/carrito", carritoRouter);
app.use("/api/ordenes", ordenesRouter);
app.use("/api/pagos", pagosRouter);

// (Opcional) Manejo básico de errores
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected error" });
});

export default app;
