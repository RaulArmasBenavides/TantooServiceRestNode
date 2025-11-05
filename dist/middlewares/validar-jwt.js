"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.varlidarADMIN_ROLE_o_MismoUsuario = exports.varlidarADMIN_ROLE = exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usuario_1 = __importDefault(require("../models/usuario"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('❌ JWT_SECRET no está definido en las variables de entorno');
}
// ✅ Middleware para validar JWT
const validarJWT = (req, res, next) => {
    console.log('Validando token...');
    const token = req.header('x-token');
    if (!token) {
        res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición',
        });
        return;
    }
    try {
        const { uid } = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.uid = uid;
        next();
    }
    catch (error) {
        console.error('Error verificando token:', error);
        res.status(401).json({
            ok: false,
            msg: 'Token no válido',
        });
    }
};
exports.validarJWT = validarJWT;
// ✅ Validar si el usuario tiene rol ADMIN
const varlidarADMIN_ROLE = async (req, res, next) => {
    const uid = req.uid;
    try {
        const usuarioDB = await usuario_1.default.findById(uid);
        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'Usuario no existe',
            });
            return;
        }
        if (usuarioDB.role !== 'ADMIN_ROLE') {
            res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso',
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};
exports.varlidarADMIN_ROLE = varlidarADMIN_ROLE;
// ✅ Validar si es ADMIN o el mismo usuario
const varlidarADMIN_ROLE_o_MismoUsuario = async (req, res, next) => {
    const uid = req.uid;
    const id = req.params.id;
    try {
        const usuarioDB = await usuario_1.default.findById(uid);
        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'Usuario no existe',
            });
            return;
        }
        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
            next();
        }
        else {
            res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso',
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};
exports.varlidarADMIN_ROLE_o_MismoUsuario = varlidarADMIN_ROLE_o_MismoUsuario;
