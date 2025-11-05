"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./database/config"); // ajusta la ruta si difiere
const PORT = Number(process.env.PORT ?? 3700);
async function bootstrap() {
    try {
        await (0, config_1.dbConnection)();
        console.log("Conexión a la base de datos establecida satisfactoriamente");
        app_1.default.listen(PORT, () => {
            console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("Error inicializando el servidor:", err);
        process.exit(1);
    }
}
bootstrap();
