"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJWT = void 0;
// src/helpers/jwt.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("❌ JWT_SECRET no está definido en las variables de entorno");
}
/**
 * Genera un token JWT firmado con el UID del usuario.
 * @param uid Identificador único del usuario
 * @returns Promise<string> con el token generado
 */
const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "12h" }, (err, token) => {
            if (err || !token) {
                console.error("❌ Error generando JWT:", err);
                reject("No se pudo generar el JWT");
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generarJWT = generarJWT;
