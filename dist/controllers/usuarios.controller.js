"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrarUsuario = exports.actualizarUsuario = exports.crearUsuario = exports.getUsuarios = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usuario_1 = __importDefault(require("../models/usuario"));
const jwt_1 = require("../helpers/jwt");
// ✅ Obtener usuarios (paginado)
const getUsuarios = async (req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const [usuarios, total] = await Promise.all([
            usuario_1.default.find({}, "nombre email role google img").skip(desde).limit(5),
            usuario_1.default.countDocuments(),
        ]);
        res.json({
            ok: true,
            usuarios,
            total,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los usuarios",
        });
    }
};
exports.getUsuarios = getUsuarios;
// ✅ Crear usuario
const crearUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existeEmail = await usuario_1.default.findOne({ email });
        if (existeEmail) {
            res.status(400).json({
                ok: false,
                msg: "El correo ya está registrado",
            });
            return;
        }
        const usuario = new usuario_1.default(req.body);
        // Encriptar contraseña
        const salt = bcryptjs_1.default.genSaltSync();
        usuario.password = bcryptjs_1.default.hashSync(password, salt);
        // Guardar usuario
        await usuario.save();
        // Generar token JWT
        const token = await (0, jwt_1.generarJWT)(usuario.id);
        res.json({
            ok: true,
            usuario,
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado... revisar logs",
        });
    }
};
exports.crearUsuario = crearUsuario;
// ✅ Actualizar usuario
const actualizarUsuario = async (req, res) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await usuario_1.default.findById(uid);
        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: "No existe un usuario por ese id",
            });
            return;
        }
        // Excluir campos no editables
        const { password, google, email, ...campos } = req.body;
        if (usuarioDB.email !== email) {
            const existeEmail = await usuario_1.default.findOne({ email });
            if (existeEmail) {
                res.status(400).json({
                    ok: false,
                    msg: "Ya existe un usuario con ese email",
                });
                return;
            }
        }
        if (!usuarioDB.google) {
            campos.email = email;
        }
        else if (usuarioDB.email !== email) {
            res.status(400).json({
                ok: false,
                msg: "Usuarios de Google no pueden cambiar su correo",
            });
            return;
        }
        const usuarioActualizado = await usuario_1.default.findByIdAndUpdate(uid, campos, { new: true });
        res.json({
            ok: true,
            usuario: usuarioActualizado,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado",
        });
    }
};
exports.actualizarUsuario = actualizarUsuario;
// ✅ Borrar usuario
const borrarUsuario = async (req, res) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await usuario_1.default.findById(uid);
        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: "No existe un usuario por ese id",
            });
            return;
        }
        await usuario_1.default.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: "Usuario eliminado",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};
exports.borrarUsuario = borrarUsuario;
