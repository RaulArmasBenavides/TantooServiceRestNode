"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// ❗ Elige una de estas dos importaciones según cómo exporten tus rutas:
// 1) Si tus rutas ya están en TS y exportan `export default router`
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
// 2) Si siguen en CommonJS (module.exports = router), usa:
// import usuariosRouter = require("./routes/usuarios");
// import projectRouter = require("./routes/project");
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
// CORS
app.use((0, cors_1.default)({
    origin: "*",
}));
// Rutas
app.use("/api/usuarios", usuarios_routes_1.default);
app.use("/api/project", project_routes_1.default);
// (Opcional) Manejo básico de errores
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Unexpected error" });
});
exports.default = app;
