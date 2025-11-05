// src/app.ts
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

// ❗ Elige una de estas dos importaciones según cómo exporten tus rutas:

// 1) Si tus rutas ya están en TS y exportan `export default router`
import usuariosRouter from "./routes/usuarios.routes";
import projectRouter from "./routes/project.routes";

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

// (Opcional) Manejo básico de errores
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected error" });
});

export default app;
